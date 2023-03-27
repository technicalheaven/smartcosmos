import { LeftOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Divider,
  Form,
  message,
  Row,
  Space,
  Steps,
  Typography,
} from "antd";
import { v4 as uuid } from "uuid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { circleAdd, errorCross } from "../../../assets/images";
import {
  constants,
  processActions,
  Roles,
  rolesOrder,
} from "../../../config/enum";
import { useGetAllDevicesQuery } from "../../../redux/services/deviceApiSlice";
import {
  useCreateProcessMutation,
  useGetProcessActionsMutation,
  useUpdateProcessMutation,
} from "../../../redux/services/processApiSlice";
import { useGetAllRolesQuery } from "../../../redux/services/roleApiSlice";
import { useGetAllSitesQuery } from "../../../redux/services/siteApiSlice";

import { useGetAllZonesQuery } from "../../../redux/services/zoneApiSlice";
import { isJsonString } from "../../../utils";
import { UIbutton, UIsecondaryButton } from "../../common/button";
import { UIcheckbox } from "../../common/checkbox";
import { UIInput } from "../../common/input";
import { UILoader } from "../../common/loader";
import { UIModal } from "../../common/modal";
import { UISelectInput } from "../../common/selectInput";
import TextArea from "../../common/textArea";
import ProcessPreview from "./processPreview";
import { ProcessVariables } from "./processVariables";
import "./style.css";
import { Regex } from "../../../config/constants";
const { Step } = Steps;

const ProcessInformation = ({
  actions,
  setActions,
  processTypes,
  formValues,
  setFormValues,
  form,
  isEdit,
  isClone,
  loopActions,
  setLoopActions,
  isCustomizedLoop,
  setIsCustomizedLoop,
  pageType,
  encodeUHFError,
  setEncodeUHFError,
}: any) => {
  const [getFeatureActions, featureActions] = useGetProcessActionsMutation();

  // Get feature actions
  useEffect(() => {
    if (featureActions?.data?.statusCode) {
      let x = featureActions?.data?.result[0]?.featureActions;
      x = x
        .filter((item: any) =>
          pageType === constants.PREDEFINED
            ? item?.name !== "Scan Barcode" && item?.isPredefined == true
            : item?.isPredefined == false
        )
        .map((item: any) => ({ text: item?.name, value: item?.id }));
      setActions(x);
    }
  }, [featureActions?.isSuccess]);

  const onProcessTypeChange = (featureId: any, data: any) => {
    form.setFieldValue("actions", [""]);
    getFeatureActions(featureId);
  };

  const onDeviceModelSelect = (value: any) => {
    setFormValues({ ...formValues, model: value });
  };

  const hasDuplicates = (arr: any) => arr.length !== new Set(arr).size;

  const getActionId = (text: any) =>
    actions.find((x: any) => x.text === text)?.value;

  const onCustomizeActionLoopClick = (e: any) => {
    setIsCustomizedLoop(e.target?.checked);
    setIsCustomizedLoop(e.target?.checked);
    setFormValues({ ...formValues, isCustomizedLoop: e.target?.checked });
  };

  let customizeLoop = "";
  if (pageType === constants.USERDEFINED && (isEdit || isClone)) {
    // Checking customized loop is enabled or not
    const states = isJsonString(formValues?.states)
      ? JSON.parse(formValues?.states)
      : {};
    const transitions = isJsonString(formValues?.transitions)
      ? JSON.parse(formValues?.transitions)
      : {};
    const lastKey =
      Object.keys(transitions)[Object.keys(transitions).length - 1];
    const actionInfo = states[lastKey];
    const action = actionInfo?.properties?.name;
    const lastTransition = transitions[lastKey];
    console.log("last transitions", lastTransition, action);
    customizeLoop = lastTransition ? lastTransition["on"][action]["to"] : "";
    form.setFieldValue("startLoop", formValues?.startLoop);
    form.setFieldValue("endLoop", loopActions.length - 1);
  }

  useEffect(() => {
    if (isCustomizedLoop) {
      setIsCustomizedLoop(true);
      onChangeAction("load");
    } else {
      setIsCustomizedLoop(false);
    }
  }, [isCustomizedLoop, isEdit, isClone]);

  useEffect(() => {
    form.setFieldValue("endLoop", loopActions[loopActions.length - 1]?.value);
  }, [loopActions]);

  const onChangeAction = (x: any = "") => {
    const selectedActions: any = form
      .getFieldValue("actions")
      .map((x: any, index: any) => ({
        text: `Action ${index + 1}`,
        value: index,
      }));

    const selectedActionFlatArray = form
      .getFieldValue("actions")
      .map((item: any) => item?.action);
    if (
      selectedActionFlatArray.includes(
        getActionId(processActions.ENCODE_UHF)
      ) &&
      !selectedActionFlatArray.includes(
        getActionId(processActions.SCAN_BARCODE)
      )
    ) {
      setEncodeUHFError(true);
    } else {
      setEncodeUHFError(false);
    }

    setLoopActions(selectedActions);
    form.setFieldValue("steps", []);
    if (x !== "load") {
      setFormValues({
        ...formValues,
        actions: form.getFieldValue("actions"),
        steps: "",
        startLoop: null,
      });
      form.setFieldValue("startLoop", null);
    }
  };

  const handleActionCheck = (values: any) => {
    let modifiedActions: any = formValues?.actions;
    let modifiedSteps = isJsonString(formValues?.steps)
      ? JSON.parse(formValues?.steps)
      : formValues?.steps;

    let uncheckedItems = actions.filter((x: any) => {
      return values.indexOf(x?.value) === -1;
    });

    // remove unchecked items from previous saved data
    if (uncheckedItems.length) {
      modifiedActions = modifiedActions.filter(
        (x: any) =>
          uncheckedItems.findIndex((y: any) => y?.value === x?.action) === -1
      );
      modifiedSteps = modifiedSteps.filter(
        (x: any) =>
          uncheckedItems.findIndex((y: any) => y?.value === x?.id) === -1
      );
    }

    // append actions into existing actions
    if (values.length) {
      let x = actions
        .filter((x: any) => values.includes(x?.value))
        .map((x: any) => ({ action: x?.value }));
      modifiedActions = [...modifiedActions, ...x];
      console.log("added actions...", x);
      let y = actions?.map((x: any) => ({
        name: x?.text,
        id: x?.value,
        key: x?.text,
      }));
      modifiedSteps = [...modifiedSteps, ...y];
      console.log("added steps...", y);
    }

    console.log({
      uncheckedItems,
      values,
      modifiedSteps,
    });

    // setSelectedPredefinedActions(modifiedActions.map((x:any)=> x?.action));

    setFormValues({
      ...formValues,
      actions: modifiedActions,
      steps: modifiedSteps,
    });
  };
  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <section className="process processInformationSection">
        <section className="headingSection">
          <Typography className="processHead">Process Information</Typography>
          <Divider className="divider1" />
        </section>
        <section className="content scroll">
          <Row gutter={14} style={{ marginBottom: "27px" }}>
            <Col span={12}>
              <UISelectInput
                label="Process Type"
                disabled={isEdit || isClone ? true : false}
                optionValue={processTypes}
                name="processType"
                placeholder="Select Process Type"
                onChange={onProcessTypeChange}
                className="pInfoLabel"
                rules={[
                  {
                    required: true,
                    message: "Please choose process type",
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <UIInput
                label="Process Name"
                name="name"
                placeholder="Enter Process Name"
                className="pInfoLabel"
                onChange={handleChange}
                rules={[
                  {
                    required: true,
                    message: "Please enter process name",
                  },
                  {
                    pattern: new RegExp(Regex.VALID_NAME),
                    message: "Process name should have 3 to 50 character",
                  },
                  formValues?.name ?
                    {
                      message:
                        "Process name should not be match with action name",
                      validator: (_: any, value: any) => {
                        const actions: any = Object.values(processActions).map(
                          (x: any) => x.toUpperCase()
                        );

                        if (!actions.includes(value.trim().toUpperCase())) {
                          return Promise.resolve();
                        } else {
                          return Promise.reject();
                        }
                      },
                    } : {},
                ]}
                disabled={pageType === constants?.PREDEFINED}
              />
            </Col>
          </Row>
          <Row style={{ marginBottom: "26px" }}>
            <Col span={24}>
              <TextArea
                label="Process Description"
                name="description"
                placeholder="Description"
                customLabelClass="pInfoLabel"
                onChange={handleChange}
                rules={[
                  {
                    pattern: new RegExp(Regex.VALID_DESCRIPTION),
                    message: "Description should have maximum 250 characters.",
                  },
                ]}
              ></TextArea>
            </Col>
          </Row>
          <Row>
            <Typography className="processStep">
              Process Step Actions
            </Typography>
          </Row>
          <Divider className="divider2"></Divider>
          {pageType === constants.PREDEFINED ? (
            <>
              <Row>
                <Col span={2}>
                  <span>Action:</span>
                </Col>
                <Col span={20}>
                  <Checkbox.Group
                    options={actions}
                    onChange={handleActionCheck}
                    defaultValue={formValues?.actions.map(
                      (x: any) => x?.action
                    )}
                    value={formValues?.actions.map((x: any) => x?.action)}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <div className="processActions">
                {encodeUHFError && (
                  <span className="error">
                    Please select Scan Barcode to proceed for Encode UHF.
                  </span>
                )}
                {/* Form list starts */}
                <Form.List name="actions" initialValue={[""]}>
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map(({ key, name, ...restFields }, i) => (
                          <Row style={{ marginBottom: "30px" }} key={key}>
                            <Col span={12} style={{ position: "relative" }}>
                              <UISelectInput
                                label={["Action ", i + 1]}
                                name={[name, "action"]}
                                optionValue={actions}
                                onChange={onChangeAction}
                                rules={[
                                  {
                                    required: true,
                                    message: `Please choose action ${i + 1}`,
                                  },
                                ]}
                                placeholder="Select Action"
                              />
                            </Col>
                            <Col span={1}>
                              <img
                                src={errorCross}
                                className="crssIcn1"
                                onClick={() => {
                                  fields.length > 1 && remove(i);
                                  onChangeAction();
                                  form.setFieldValue("startLoop", null);
                                }}
                              ></img>
                            </Col>
                          </Row>
                        ))}

                        <Row style={{ marginBottom: "35px" }}>
                          <div
                            className="addAnotherStepBtn"
                            onClick={() => add()}
                          >
                            <img src={circleAdd} />
                            <Typography className="prcsAdd">
                              Add Another Step Action
                            </Typography>
                          </div>
                        </Row>
                      </>
                    );
                  }}
                </Form.List>

                {/* Form list ends */}
              </div>

              <Row style={{ marginBottom: "35px" }}>
                <Typography className="prcsDefault">
                  By default, actions will loop back to the start after the last
                  action in the process. If you would like to customize this
                  behavior click the checkbox below.
                </Typography>
              </Row>
              {form.getFieldValue("actions") !== undefined &&
                form.getFieldValue("actions").length > 1 && (
                  <section className="customizeLoopUi">
                    <div className="control">
                      <Checkbox
                        checked={isCustomizedLoop}
                        onChange={onCustomizeActionLoopClick}
                      >
                        Customize Action Loop
                      </Checkbox>
                    </div>

                    {isCustomizedLoop && (
                      <div className="loopInputs">
                        <UISelectInput
                          label="Start Loop"
                          name="startLoop"
                          placeholder="Start Action"
                          className="pInfoLabel"
                          optionValue={loopActions}
                          rules={[
                            {
                              required: true,
                              message: "This field is required.",
                            },
                          ]}
                        />

                        <UISelectInput
                          label="End Loop"
                          name="endLoop"
                          placeholder="End Action"
                          className="pInfoLabel endLoop"
                          disabled={true}
                          optionValue={loopActions}
                          rules={[
                            {
                              required: true,
                              message: "This field is required.",
                            },
                          ]}
                        />
                      </div>
                    )}

                    {/* isCustomizedLoop */}
                  </section>
                )}
            </>
          )}
        </section>
      </section>
    </>
  );
};

const ProcessInstruction = ({ form, formValues, setFormValues }: any) => {
  return (
    <>
      <section className="process processInstructionSection">
        <section className="headingSection">
          <Typography className="processHead">Process Instructions</Typography>
          <Divider className="divider1" />
        </section>

        <section className="content">
          <section className="info">
            <p>
              If you would like to add instructions for the station operator,
              please enter them below. Instructions will be available through an
              information icon on the station at any time
            </p>
          </section>

          <Row style={{ marginBottom: "26px" }}>
            <Col span={24}>
              <TextArea
                rows={4}
                label="Instructions"
                name="instruction"
                placeholder="Instruction"
                customLabelClass="pInfoLabel"
              ></TextArea>
            </Col>
          </Row>
        </section>
      </section>
    </>
  );
};

const AssignProcess = ({
  setFormValues,
  formValues,
  tenantId,
  loader,
  setLoader,
  form,
  roles,
  setRoles,
}: any) => {
  const [devices, setDevices] = useState([]);
  const [sites, setSites] = useState([]);
  const [zones, setZones] = useState([]);
  const [sitezones, setSiteZones] = useState([]);

  //roles
  const tenantRoleQuery: any = useGetAllRolesQuery({});

  //sites
  const tenantSitesQuery = useGetAllSitesQuery({ tenantId: tenantId });

  //devices
  const tenantDeviceQuery = useGetAllDevicesQuery({ tenant: tenantId });

  //zones
  const tenantZonesQuery = useGetAllZonesQuery({ tenant: tenantId });

  console.log({ tenantZonesQuery });

  useEffect(() => {
    console.log("xyz useeffect", formValues?.assign?.sites, zones);
    if (
      (formValues?.assign?.sites || form.getFieldValue("sites")) &&
      zones != undefined
    ) {
      let sites = formValues?.assign?.sites || form.getFieldValue("sites");
      getSiteRelatedZones(sites);
    }
  }, [zones]);

  useEffect(() => {
    if (tenantRoleQuery?.data?.statusCode) {
      let x: any = tenantRoleQuery?.data?.result?.rows.map((item: any) => {
        let roleOrder = rolesOrder.find(
          (x: any) => x?.name === item?.name
        )?.order;
        return {
          label: item?.name,
          value: item?.id,
          order: roleOrder,
          isPlatformRole: item?.isPlatformRole,
        };
      });

      // sort roles higher to lower
      x = x.sort((a: any, b: any) => a.order - b.order);
      console.log("roles..", x);
      setRoles(x);
    }
  }, [tenantRoleQuery?.isSuccess]);

  useEffect(() => {
    if (tenantDeviceQuery?.data?.statusCode) {
      let x: any = tenantDeviceQuery?.data?.result?.rows?.map((item: any) => {
        return {
          text: item?.name,
          value: item?.id,
          siteId: item?.siteId,
        };
      });
      setDevices(x);
    }
  }, [tenantDeviceQuery?.isSuccess]);

  useEffect(() => {
    if (tenantSitesQuery?.data?.statusCode) {
      let x: any = tenantSitesQuery?.data?.result?.rows?.map((item: any) => {
        return {
          text: item?.name,
          value: item?.id,
        };
      });
      setSites(x);
    }
  }, [tenantSitesQuery?.isSuccess]);

  useEffect(() => {
    let x: any = tenantZonesQuery?.data?.result?.rows?.map((item: any) => {
      return {
        text: `${item?.siteName} - ${item?.name}`,
        value: item?.id,
        siteId: item?.siteId,
      };
    });
    setZones(x);
  }, [tenantZonesQuery?.isSuccess]);

  //manage loader
  useEffect(() => {
    if (
      tenantRoleQuery?.isSuccess &&
      tenantDeviceQuery?.isSuccess &&
      tenantSitesQuery?.isSuccess &&
      tenantZonesQuery?.isSuccess
    ) {
      setLoader(false);
    }
  }, [
    tenantRoleQuery?.isSuccess,
    tenantDeviceQuery?.isSuccess,
    tenantSitesQuery?.isSuccess,
    tenantZonesQuery?.isSuccess,
  ]);
  useEffect(() => {
    if (
      tenantRoleQuery?.isError &&
      tenantDeviceQuery?.isError &&
      tenantSitesQuery?.isError &&
      tenantZonesQuery?.isError
    ) {
      message.error("Something went wrong.");
    }
  }, [
    tenantRoleQuery?.isError,
    tenantDeviceQuery?.isError,
    tenantSitesQuery?.isError,
    tenantZonesQuery?.isError,
  ]);

  const getSiteRelatedZones = (selectedSites: any) => {
    let siteRelatedZones: any = [];
    selectedSites.map((siteId: any) => {
      const temp = zones.filter((x: any) => siteId === x.siteId);
      siteRelatedZones = [...siteRelatedZones, ...temp];
    });
    console.log({ siteRelatedZones, zones, selectedSites });
    setSiteZones(siteRelatedZones);
  };
  const onDevicesChange = (e: any) => {
    setFormValues({
      ...formValues,
      assign: { ...formValues?.assign, devices: e },
    });
  };
  return (
    <>
      <section className="process assignProcessSection">
        <section className="headingSection">
          <Typography className="processHead">Assign Process</Typography>
          <Divider className="divider1" />
        </section>

        <section className="content">
          <section className="assignProcessSection">
            <div className="info">
              <div className="title">
                Role<sup>*</sup>
              </div>
              <div>Select roles execute to the process</div>
            </div>
            <Space>
              <Checkbox.Group
                style={{ width: "100%" }}
                name="roles"
                options={roles.filter(
                  (item: any) =>
                    !(
                      item?.label === Roles.API_OPERATOR ||
                      item?.label === Roles.API_OPERATOR_READ_ONLY ||
                      item?.label === Roles.FACTORY_OPERATOR ||
                      item?.label === Roles.PLATFORM_SUPER_ADMIN ||
                      item?.label === Roles.PLATFORM_ADMIN
                    )
                )}
                defaultValue={formValues?.assign?.roles}
                value={formValues?.assign?.roles}
                onChange={(values) => {
                  setFormValues({
                    ...formValues,
                    assign: { ...formValues?.assign, roles: values },
                  });
                }}
              />
            </Space>

            <Divider className="divider1" />

            <Row gutter={20}>
              <Col span={12}>
                <UISelectInput
                  label="Devices"
                  name="devices"
                  optionValue={devices}
                  placeholder="Select Device"
                  rules={[
                    { message: "This field is required.", required: true },
                  ]}
                  mode="multiple"
                  onChange={onDevicesChange}
                />
              </Col>
            </Row>
            <Divider style={{ margin: "40px 0" }} />

            <Row gutter={20}>
              <Col span={12}>
                <UISelectInput
                  label="Sites"
                  onChange={(values: any) => {
                    setFormValues({
                      ...formValues,
                      assign: {
                        ...formValues?.assign,
                        sites: values,
                        zones: [],
                      },
                    });
                    getSiteRelatedZones(values);
                    form.setFieldValue("zones", []);
                  }}
                  name="sites"
                  optionValue={sites}
                  placeholder="Select Site"
                  mode="multiple"
                />
              </Col>

              <Col span={12}>
                <UISelectInput
                  label="Zones"
                  name="zones"
                  placeholder="Select Zone"
                  optionValue={sitezones}
                  mode="multiple"
                  onChange={(values: any) => {
                    setFormValues({
                      ...formValues,
                      assign: { ...formValues?.assign, zones: values },
                    });
                  }}
                />
              </Col>
            </Row>
          </section>
        </section>
      </section>
    </>
  );
};

const FinalizeProcess = ({ formValues, isCustomizedLoop }: any) => {
  const steps = formValues?.steps;
  console.log("inside finalize process", formValues);

  return (
    <>
      <section className="process processInstructionSection">
        <section className="headingSection">
          <Typography className="processHead">Finalize Process</Typography>
          <Divider className="divider1" />
        </section>

        <section className="content">
          <section className="info">
            <p>
              Below is the process in its final form as the device will see it.
            </p>
          </section>

          <ProcessPreview
            steps={steps}
            startLoop={isCustomizedLoop ? formValues?.startLoop : 0}
          />
        </section>
      </section>
    </>
  );
};

const ProcessCurrentForm = ({
  formValues,
  setFormValues,
  current,
  setCurrent,
  setVisible,
  actions,
  setActions,
  processTypes,
  refetch,
  tenantId,
  isEdit,
  isClone,
  form,
  loader,
  setLoader,
  loopActions,
  setLoopActions,
  isCustomizedLoop,
  setIsCustomizedLoop,
  pageType,
}: any) => {
  const [isPredefinedSubmit, setIsPredefinedSubmit] = useState(false);
  const [encodeUHFError, setEncodeUHFError] = useState(false);
  const [roles, setRoles] = useState([]);
  const [createProcess, createProcessResponse] = useCreateProcessMutation();
  const [updateProcess, updateProcessResponse] = useUpdateProcessMutation();
  const userInfo = useSelector((state: any) => state.auth)?.user;
  // set initialvalues for edit case

  if (isEdit || isClone) {
    form.setFieldsValue({
      processType: formValues?.processType,
      name: formValues?.name,
      description: formValues?.description,
      actions: formValues?.actions,
      steps: isJsonString(formValues?.steps)
        ? JSON.parse(formValues?.steps)
        : [],
      instruction: formValues?.instruction,
      devices: formValues?.assign?.devices,
      sites: formValues?.assign?.sites,
      zones: formValues?.assign?.zones,
    });
  }

  useEffect(() => {
    if (isPredefinedSubmit) {
      onFinish(true);
    }
  }, [isPredefinedSubmit]);

  useEffect(() => {
    if (createProcessResponse?.error?.data?.error) {
      message.error(createProcessResponse?.error?.data?.error?.message);
    }
    setLoader(false)
  }, [createProcessResponse?.isError]);

  const changeStep = (type: any = "") => {
    const predefinedSteps: any = [0, 2, 3];
    const MIN = 0;
    const MAX = 5;

    if (type == "inc") {
      pageType === constants.PREDEFINED
        ? setCurrent(
          current < MAX
            ? predefinedSteps[predefinedSteps.indexOf(current) + 1]
            : MAX
        )
        : setCurrent(current < MAX ? current + 1 : MAX);
    } else if (type == "reset") {
      setCurrent(0);
    } else {
      pageType === constants.PREDEFINED
        ? setCurrent(
          current > MIN
            ? predefinedSteps[predefinedSteps.indexOf(current) - 1]
            : MIN
        )
        : setCurrent(current > MIN ? current - 1 : MIN);
    }
    console.log("min-max", MIN, MAX);
  };

  useEffect(() => {
    if (createProcessResponse?.data?.statusCode) {
      // reset states
      setLoader(false)
      setVisible(false);
      setFormValues({});
      setCurrent(0);
      //reset form fields
      form.resetFields();
      message.success("Process created SuccessFully");
      refetch();
    }
  }, [createProcessResponse?.isSuccess]);

  useEffect(() => {
    if (updateProcessResponse?.data?.statusCode) {
      // reset states
      setVisible(false);
      setFormValues({});
      setCurrent(0);

      //reset form fields
      form.resetFields();
      message.success("Process updated SuccessFully");
      refetch();
      setLoader(false)
    }
  }, [updateProcessResponse?.isSuccess]);

  useEffect(() => {
    if (updateProcessResponse?.isError) {
      setLoader(false)
      message?.error(updateProcessResponse?.error?.data?.error?.message)
    }
  }, [updateProcessResponse?.isError])

  const ActionControls = () => {
    return (
      <>
        <Divider className="divider3"></Divider>
        <section className="d-flex justify-content-between">
          <div className="btn-group">
            <Space size={26}>
              {current !== 0 ? (
                <div
                  className="prcsBack"
                  onClick={() => {
                    setFormValues({
                      ...formValues,
                      steps: form.getFieldValue("steps").length
                        ? form.getFieldValue("steps")
                        : formValues?.steps,
                    });
                    changeStep();
                  }}
                >
                  <LeftOutlined className="bckIcn" />
                  <b>BACK</b>
                </div>
              ) : (
                <></>
              )}
              <UIsecondaryButton
                onPress={() => {
                  form.resetFields();
                  changeStep("reset");
                  setVisible(false);
                }}
                size="sm"
                btnType="button"
              >
                CANCEL
              </UIsecondaryButton>
            </Space>
          </div>

          <div className="btn-group">
            <UIbutton
              type="info"
              btnType="submit"
              size="sm"
              className="continueBtn"
            >
              CONTINUE
            </UIbutton>
          </div>
        </section>
      </>
    );
  };

  const reformatStateProperties = (obj: any) => {
    const { name, ...fields } = obj;
    let properties: any = {};
    switch (name) {
      case processActions.ADD_INPUT: {
        let temp: any = {
          key: fields?.labelText,
          value: "",
        };
        properties = {
          input: [temp],
        };
        break;
      }
      case processActions.SCAN_BARCODE: {
        let temp: any = {
          key: fields?.validation,
          value: fields?.value,
        };
        properties = {
          validation: [temp],
        };
        break;
      }
      case processActions.SCAN_NFC:
      case processActions.SCAN_QRCODE: {
        let temp: any = {
          key: fields?.urlValidation,
          value: fields?.value,
        };
        properties = {
          validation: [temp],
        };
        break;
      }
      case processActions.ENCODE_NFC: {
        let temp: any = {
          key: "url",
          value: fields?.url,
        };
        properties = {
          input: [temp],
          lockTag: fields?.lockTag,
        };
        break;
      }
      case processActions.ENCODE_UHF: {
        let temp: any = [
          { key: "companyPrefix", value: fields?.companyPrefix },
          { key: "itemReference", value: fields?.itemReference },
          { key: "serialNumber", value: fields?.serialNumber },
        ];
        properties = {
          input: [...temp],
          lockTag: fields?.lockTag,
        };
        break;
      }
      case processActions.SCAN_UHF: {
        properties = {};
        break;
      }
    }

    return { name, ...properties };
  };

  const onFinish = (isFinalized: any) => {
    const steps =
      pageType === constants.PREDEFINED && isJsonString(formValues?.steps)
        ? JSON.parse(formValues?.steps)
        : formValues?.steps;

    // assign random unique id to steps
    const modifiedSteps = steps.map((x: any) => ({ ...x, id: uuid() }));

    // prepare states data
    let states = {};
    modifiedSteps.forEach((element: any) => {
      const { id, name, key, ...fields } = element;

      let temp = {
        [id]: {
          metadata: {
            version: "",
          },
          properties: {
            ...reformatStateProperties(element),
          },
        },
      };
      states = { ...states, ...temp };
    });

    // prepare transitions data
    let transitions = {};
    const loopAction =
      pageType === constants.USERDEFINED && isCustomizedLoop
        ? modifiedSteps[formValues?.startLoop]?.id
        : modifiedSteps[0]["id"];

    modifiedSteps.forEach((element: any, index: any) => {
      const { id, key } = element;
      let temp = {
        [id]: {
          onEnter: {},
          on: {
            [key]: {
              condition: "",
              value: "",
              to:
                index + 1 < modifiedSteps.length
                  ? modifiedSteps[index + 1]["id"]
                  : loopAction,
            },
          },
          onExit: {},
        },
      };
      transitions = { ...transitions, ...temp };
    });

    // extracting platform roles ids
    const platformRolesIds: any = roles
      .filter((x: any) => x?.isPlatformRole)
      .map((x: any) => x?.value);
    console.log({ platformRolesIds, roles });

    const payload: any = {
      tenantId,
      processType: formValues?.processType,
      name: formValues?.name,
      description: formValues?.description,
      instruction: formValues?.instruction,
      initialState: modifiedSteps[0]["id"],
      actions: formValues?.actions,
      steps: JSON.stringify(steps),
      states: JSON.stringify(states),
      transitions: JSON.stringify(transitions),
      isFinalized: isFinalized ? 1 : 0,
      isCustomizedLoop: isCustomizedLoop ? 1 : 0,
      startLoop: isCustomizedLoop ? formValues?.startLoop : 0,
      assign: {
        roles: Array.from(
          new Set([...platformRolesIds, ...formValues?.assign?.roles])
        ), // add platform roles id and remove duplicates
        devices: formValues?.devices ?? [],
        sites: formValues?.sites ?? [],
        zones: formValues?.zones ?? [],
      },
      status: "active",
      minStationVer: "",
    };

    console.log("final submit", { ...payload, formValues });

    if (isEdit) {
      updateProcess({
        ...payload,
        id: formValues?.id,
        updatedBy: userInfo?.id,
      });
      setIsPredefinedSubmit(false);
    } else {
      createProcess({ ...payload, createdBy: userInfo?.id });
    }
  };

  const steps = Array.isArray(formValues?.steps)
    ? formValues?.steps
    : isJsonString(formValues?.steps)
      ? JSON.parse(formValues?.steps)
      : [];

  switch (current) {
    case 0:
      return (
        <Form
          id="form1"
          onFinish={(values: any) => {
            if (!encodeUHFError) {
              setFormValues({ ...formValues, ...values });
              changeStep("inc");
            }
          }}
          form={form}
          className="processInformationForm"
          layout="vertical"
        >
          <ProcessInformation
            form={form}
            formValues={formValues}
            setFormValues={setFormValues}
            actions={actions}
            setActions={setActions}
            tenantId={tenantId}
            processTypes={processTypes}
            isEdit={isEdit}
            isClone={isClone}
            loopActions={loopActions}
            setLoopActions={setLoopActions}
            isCustomizedLoop={isCustomizedLoop}
            setIsCustomizedLoop={setIsCustomizedLoop}
            pageType={pageType}
            encodeUHFError={encodeUHFError}
            setEncodeUHFError={setEncodeUHFError}
          />
          <ActionControls />
        </Form>
      );
    case 1:
      return (
        <Form
          id="form2"
          onFinish={(values: any) => {
            setFormValues({ ...formValues, ...values });
            changeStep("inc");
          }}
          form={form}
          className="processVariablesForm"
          layout="vertical"
        >
          <ProcessVariables
            formValues={formValues}
            setFormValues={setFormValues}
            actions={actions}
            form={form}
            showTitleInfo={true}
            steps={steps}
            isEdit={isEdit}
          />
          <ActionControls />
        </Form>
      );
    case 2:
      return (
        <Form
          id="form3"
          onFinish={(values: any) => {
            setFormValues({ ...formValues, ...values });
            changeStep("inc");
            setLoader(true);
          }}
          form={form}
          className="processInstructionForm"
          layout="vertical"
        >
          <ProcessInstruction
            form={form}
            formValues={formValues}
            setFormValues={setFormValues}
          />
          <ActionControls />
        </Form>
      );
    case 3:
      return (
        <Form
          id="form4"
          onFinish={(values: any) => {
            setFormValues({ ...formValues, ...values });
            if (
              formValues?.assign?.roles === undefined ||
              !formValues?.assign.roles?.length
            ) {
              message.error("Please choose role.");
            } else if (pageType === constants.PREDEFINED) {
              console.log("on finish called predefined case....", {
                ...formValues,
                ...values,
              });
              setIsPredefinedSubmit(true);
            } else {
              changeStep("inc");
            }
          }}
          form={form}
          className="assignProcessForm"
          layout="vertical"
        >
          <AssignProcess
            form={form}
            formValues={formValues}
            setFormValues={setFormValues}
            tenantId={tenantId}
            loader={loader}
            setLoader={setLoader}
            roles={roles}
            setRoles={setRoles}
          />
          {pageType === constants.PREDEFINED ? (
            <section className="d-flex justify-content-between">
              <div className="btn-group">
                <Space size={26}>
                  {current !== 0 ? (
                    <div
                      className="prcsBack"
                      onClick={() => {
                        changeStep();
                      }}
                    >
                      <LeftOutlined className="bckIcn" />
                      <b>BACK</b>
                    </div>
                  ) : (
                    <></>
                  )}
                  <UIsecondaryButton
                    onPress={() => {
                      form.resetFields();
                      changeStep("reset");
                      setVisible(false);
                    }}
                    size="sm"
                    btnType="button"
                  >
                    CANCEL
                  </UIsecondaryButton>
                </Space>
              </div>

              <div className="btn-group">
                <UIbutton
                  type="info"
                  btnType="submit"
                  size="sm"
                  className="finalizeBtn"
                >
                  FINALIZE
                </UIbutton>
              </div>
            </section>
          ) : (
            <ActionControls />
          )}
        </Form>
      );
    case 4:
      return (
        <>
          <FinalizeProcess
            formValues={formValues}
            setFormValues={setFormValues}
            isCustomizedLoop={isCustomizedLoop}
          />

          <Divider className="divider3"></Divider>
          <section className="d-flex justify-content-between">
            <div className="btn-group">
              <Space size={26}>
                <div
                  className="prcsBack"
                  onClick={() => {
                    changeStep();
                  }}
                >
                  <LeftOutlined className="bckIcn" />
                  <b>BACK</b>
                </div>
                <UIsecondaryButton
                  onPress={() => {
                    setVisible(false);
                    form.resetFields();
                    changeStep("reset");
                  }}
                  size="sm"
                  btnType="button"
                >
                  CANCEL
                </UIsecondaryButton>
              </Space>
            </div>

            <div className="btn-group">
              <Space size={26}>
                <UIbutton
                  type="info"
                  btnType="button"
                  size="sm"
                  className="draftBtn"
                  onPress={() => {
                    onFinish(false);
                  }}
                >
                  SAVE AS DRAFT
                </UIbutton>

                <UIbutton
                  type="info"
                  btnType="button"
                  size="sm"
                  className="finalizeBtn"
                  onPress={() => {
                    onFinish(true);
                    setLoader(true)
                  }}
                >
                  FINALIZE
                </UIbutton>
              </Space>
            </div>
          </section>
        </>
      );
    default:
      return <></>;
  }
};

export const ProcessStepForm = ({
  visible,
  setVisible,
  refetch,
  formValues,
  setFormValues,
  isEdit,
  isClone,
  processTypes,
  actions,
  setActions,
  form,
  isCustomizedLoop,
  setIsCustomizedLoop,
  pageType,
}: any) => {
  const [current, setCurrent] = useState(0);
  const [loader, setLoader] = useState(false);
  const [processStatus, setProcessStatus] = useState("");
  const [loopActions, setLoopActions] = useState([]);
  console.log("current", current);

  const { id: tenantId } = useSelector((state: any) => state.tenant);

  console.log({ formValues });

  return (
    <>
      {loader && <UILoader />}
      <UIModal
        title={
          isEdit ? "Edit Process" : isClone ? "Clone Process" : "Create Process"
        }
        visible={visible}
        width={1200}
        className={"processModal zoomModal"}
        footer={false}
      >
        <Row>
          <Col span={6}>
            {pageType === "predefined" ? (
              <Steps
                direction="vertical"
                current={current > 1 ? current - 1 : current}
                style={{ height: "100%" }}
              >
                <Step title="Process Information" />
                <Step title="Process Instructions" />
                <Step title="Assign Process" />
              </Steps>
            ) : (
              <Steps
                direction="vertical"
                current={current}
                style={{ height: "100%" }}
              >
                <Step title="Process Information" />
                <Step title="Process Variables" />
                <Step title="Process Instructions" />
                <Step title="Assign Process" />
                <Step title="Finalize Process" />
              </Steps>
            )}
          </Col>
          <Col span={1}>
            <Divider type="vertical" className="verticalDivider" />
          </Col>

          <Col span={17}>
            <ProcessCurrentForm
              formValues={formValues}
              setFormValues={setFormValues}
              current={current}
              setCurrent={setCurrent}
              setVisible={setVisible}
              actions={actions}
              setActions={setActions}
              processTypes={processTypes}
              processStatus={processStatus}
              setProcessStatus={setProcessStatus}
              tenantId={tenantId}
              refetch={refetch}
              isEdit={isEdit}
              isClone={isClone}
              form={form}
              loader={loader}
              setLoader={setLoader}
              isCustomizedLoop={isCustomizedLoop}
              setIsCustomizedLoop={setIsCustomizedLoop}
              loopActions={loopActions}
              setLoopActions={setLoopActions}
              pageType={pageType}
            />
          </Col>
        </Row>
      </UIModal>
    </>
  );
};
