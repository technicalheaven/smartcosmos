import { LeftOutlined } from "@ant-design/icons";
import { Card, Col, Row, Form } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { previewIcon, processDarkIcon } from "../../../assets/icons";
import { constants, PageTitle } from "../../../config/enum";
import { setProcess } from "../../../redux/features/process/processSlice";
import { useGetProcessActionsMutation, useGetProcessDetailsQuery } from "../../../redux/services/processApiSlice";
import { useGetTenantByIdQuery } from "../../../redux/services/tenantApiSlice";
import { Page } from "../../../routes/config";
import { isJsonString } from "../../../utils";
import { UIImage } from "../../common/image";
import { UIInput } from "../../common/input";
import { UILoader } from "../../common/loader";
import { UIModal } from "../../common/modal";
import { UISelectInput } from "../../common/selectInput";
import { getActionIcon } from "./common";
import ProcessPreview from "./processPreview";
import { ProcessVariables } from "./processVariables";

const ProcessDetails = () => {
  const { id: processId, type } = useParams();
  const tenantState = useSelector((state: any) => state.tenant);
  const tenantId: any = tenantState?.id;
  const processDetailsQuery = useGetProcessDetailsQuery(processId);
  const [details, setDetails] = useState<any>({});
  const [actions, setActions] = useState<any>({});
  const [processTypes, setProcessTypes] = useState([]);
  const [loader, setLoader] = useState(true);
  const [previewModalvisible, setPreviewModalvisible] = useState(false);
  const [getFeatureActions, featureActions] = useGetProcessActionsMutation();
  const [form] = useForm();

  const tenantQuery: any = useGetTenantByIdQuery(tenantId);
  const dispatch = useDispatch();
  // Get process details
  useEffect(() => {
    if (processDetailsQuery?.data?.statusCode) {
      const x: any = processDetailsQuery?.data?.result;
      setDetails(x);
      setLoader(false);
      getFeatureActions(x?.processType);
      form.setFieldsValue({
        steps: isJsonString(x?.steps) ? JSON.parse(x?.steps) : []
      })
      console.log('wrewr', { id: x.id, name: x?.name });

      dispatch(setProcess({ id: x.id, name: x?.name }));
    }
  }, [processDetailsQuery?.isSuccess, processDetailsQuery?.data?.result?.updatedAt]);

  // Get process types
  useEffect(() => {
    if (tenantQuery?.data?.statusCode) {
      let x = tenantQuery?.data?.result?.tenantFeatures;
      x = x
        .filter((item: any) => item.isEnabled)
        .map((item: any) => ({
          text: item?.featureName,
          value: item?.featureId,
        }));
      setProcessTypes(x);
    }
  }, [tenantQuery?.isSuccess]);

  const onPreviewClick = () => {
    setPreviewModalvisible(true);
  }

  // Get feature actions
  useEffect(() => {
    if (featureActions?.data?.statusCode) {
      let x = featureActions?.data?.result[0]?.featureActions;
      x = x.map((item: any) => ({ text: item?.description, value: item?.id }));
      setActions(x);
    }
  }, [featureActions?.isSuccess, processDetailsQuery?.isSuccess]);

  let processType: any = processTypes.find((x: any) => x?.value === details?.processType);

  let customizeLoop = "";
  const steps = isJsonString(details.steps) ? JSON.parse(details.steps) : [];
  const states = isJsonString(details?.states) ? JSON.parse(details?.states) : {};
  const transitions = isJsonString(details?.transitions) ? JSON.parse(details?.transitions) : {};
  const lastKey = Object.keys(transitions)[Object.keys(transitions).length - 1];
  const actionInfo = states[lastKey];
  const action = actionInfo?.properties?.name;
  const lastTransition = transitions[lastKey];
  customizeLoop = type === constants.USERDEFINED && lastTransition ? lastTransition['on'][action]['to'] : "";

  return (
    <>
      {loader && (<UILoader />)}
      <main className="processDetails">
        <section className="title-section">
          <Card className="uicard">
            <Row>
              <Col span={24}>
                <div className="backButton">
                  <Link className="link" to={type === "predefined" ? `${Page.PRE_DEFINED_PROCESS}/${tenantId}` : `${Page.USER_DEFINED_PROCESS}/${tenantId}`}>
                    <LeftOutlined className="left-back-button" />
                    <b className="top-back-text">BACK</b>
                  </Link>
                </div>
              </Col>
              <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                <div className="info">
                  <div className="title">{details?.name}</div>
                  <p className="description">
                    {details?.description}
                  </p>
                </div>
              </Col>
            </Row>
          </Card>
        </section>

        <section className="details">
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8} xl={8}>
              <section className="processInformation">
                <Card>
                  <div className="heading">Process Information</div>
                  <ul className="info">
                    <li>
                      <div className="title">Status</div>
                      <div className="text capitalize">{!details?.isFinalized ? "Draft" : details?.status}</div>
                    </li>
                    <li>
                      <div className="title">Type</div>
                      <div className="text">{processType?.text}</div>
                    </li>
                  </ul>

                  <div className="heading">
                    <span className="text">Steps</span>
                    <span className="previewIcon" onClick={onPreviewClick}>
                      <UIImage src={previewIcon} width={20} />
                      <span>Preview</span>
                    </span>
                  </div>
                  <ol className="steps">
                    {steps.map((item: any) => (<li>{item?.name}</li>))}
                  </ol>

                  <section className="instructions">
                    <div className="heading">Instruction</div>
                    <p className="instructionParagraph">
                      {details?.instruction}
                    </p>
                  </section>
                </Card>
              </section>
            </Col>
            <Col xs={24} md={24} lg={16} xl={16}>
              <section className="processStepDetails">
                <Card>
                  <div className="heading" style={{ marginBottom: "20px" }}>Process Step Details</div>
                  <div className="steps instructionParagraph">
                    {Object.keys(details).length && (
                      <Form disabled={true} form={form}>
                        <ProcessVariables
                          formValues={details}
                          actions={actions}
                          showTitleInfo={false}
                          form={form}
                          steps={steps}
                          className="proDetails"
                          details={true}
                        />
                      </Form>
                    )}
                  </div>

                </Card>
              </section>
            </Col>
          </Row>
        </section>

        <UIModal
          title={""}
          visible={previewModalvisible}
          handleCancel={() => { setPreviewModalvisible(false) }}
          width={1200}
          className={"processModal"}
          footer={false}
          closable={true}
        >
          <ProcessPreview steps={steps} startLoop={details?.isCustomizedLoop ? details?.startLoop : 0} />
        </UIModal>
      </main>
    </>
  );
};

export default ProcessDetails;