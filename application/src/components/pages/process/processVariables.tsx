import { InfoCircleFilled } from "@ant-design/icons";
import { Checkbox, Col, Divider, Form, Row, Steps, Typography } from "antd";
import Title from "antd/lib/typography/Title";
import { useEffect, useState } from "react";
import { Regex } from "../../../config/constants";
import { processActions } from "../../../config/enum";
import { UIbutton } from "../../common/button";
import { UIcheckbox } from "../../common/checkbox";
import { UIImage } from "../../common/image";
import { UIInput } from "../../common/input";
import { UISelectInput } from "../../common/selectInput";
import UITooltip from "../../common/tooltip";
import { getActionIcon, getKeyName } from "./common";

export const ProcessVariables = ({ steps, form, setFormValues, formValues, actions, showTitleInfo, details }: any) => {
  const [validationBarCode, setValidationBarCode] = useState([]);
  const [urlValidationQrCode, setUrlValidationQrCode] = useState([]);
  const [urlValidationNFC, setUrlValidationNFC] = useState([]);
  const [testStringQrCode, setTestStringQrCode] = useState([]);
  const [testStringNFC, setTestStringNFC] = useState([]);
  const [testStringBarcode, setTestStringBarcode] = useState([]);

  const selectedActions = actions.length ? formValues?.actions.map((item: any) => {
    return actions.find((x: any) => x?.value === item?.action);
  }) : [];

  console.log('steps:', steps, "formSteps:", form.getFieldValue('steps'), "formvalues:", formValues?.steps, { selectedActions });

  let stepsData = steps.length ? steps : form.getFieldValue('steps') != undefined && form.getFieldValue('steps').length ? form.getFieldValue('steps') : selectedActions.map((x: any) => ({
    name: x?.text,
    id: x?.value,
    key: x?.text,
  }))

  const stringTester = (e: any) => {
    const stepElement = e.target.offsetParent.offsetParent.offsetParent.offsetParent;
    const testString = e.target.value.trim();
    const validationType = stepElement?.querySelector('.validationType .ant-select-selection-item').title;
    const validationValue = stepElement?.querySelector('.validationValue input').value;
    let result = false;
    console.log({ validationType, validationValue });

    switch (validationType) {
      case 'Contains': { result = testString.includes(validationValue); break; }
      case 'Starts With': {
        result = testString.startsWith(validationValue);
        break;
      }
      case 'Regular Expression': {
        const pattern = new RegExp(validationValue, "g");
        result = pattern.test(testString);
        break;
      }
      default: result = false;
    }

    stepElement.querySelector('.stringResult').innerHTML = result ? `<span style="color: #138098;
      font-weight: 700;">MATCHED</span>` : `<span style="color: #e91e63;
      font-weight: 700;">NOT MATCHED</span>`;

  }


  // set states on page load
  useEffect(() => {
    if (stepsData.length) {
      let _urlValidationQrCode: any = [...urlValidationQrCode];
      let _urlValidationNFC: any = [...urlValidationNFC];
      let _validationBarCode: any = [...validationBarCode];

      steps.forEach((step: any, index: any) => {
        switch (step?.name) {
          case processActions.SCAN_QRCODE: {
            _urlValidationQrCode[index] = step?.urlValidation;
            setUrlValidationQrCode(_urlValidationQrCode);
            break;
          }
          case processActions.SCAN_NFC: {
            _urlValidationNFC[index] = step?.urlValidation;
            setUrlValidationNFC(_urlValidationNFC);
            break;
          }
          case processActions.SCAN_BARCODE: {
            _validationBarCode[index] = step?.validation;
            setValidationBarCode(_validationBarCode);
            break;
          }
        }
      });
      form.setFieldValue('steps', stepsData);
    }
    console.log('steps...', stepsData);

  }, []);

  console.log({ urlValidationNFC, urlValidationQrCode });


  const urlValidationOptions = [
    { text: "None", value: "none" },
    { text: "Starts With", value: "starts" },
    { text: "Contains", value: "contains" },
    { text: "Regular Expression", value: "regex" },
  ];

  const validationOptions = [
    { text: "None", value: "none" },
    { text: "Length 12 (ex. UPC)", value: "length12" },
    { text: "Length 13 (ex. EAN)", value: "length13" },
    { text: "Length 14 (ex. GTIN)", value: "length14" },
    { text: "Not Less Than 12", value: "lengthNotLess12" },
    { text: "Regular Expression", value: "regex" },
  ];

  const hints = {
    regex:
      "A regular express is an advanced feature which allows for validation of the URL and the format of additional information encoded on the RFID tag. While an example has been provided, only individuals with knowledge of regular expressions should use this feature.",
    encodeNfcUrl:
      "The parameter {tagId} can be used in the URL and will be replaced on demand with the UID of the NFC tag. Example: https://example.com/tap?id={tagId}&foo=bar.",
  };


  const encodeUHFOptions = [
    { text: "QR_CODE", value: "QR_CODE", action: processActions.SCAN_QRCODE },
    { text: "BAR_CODE", value: "BAR_CODE", action: processActions.SCAN_BARCODE },
    { text: "TEXT_INPUT", value: "TEXT_INPUT", action: processActions.ADD_INPUT },
  ].filter((x: any) => selectedActions.findIndex((y: any) => y.text === x?.action) !== -1);


  return (
    <>
      <section className="process processVariablesSection">
        {showTitleInfo && (
          <>
            <section className="headingSection">
              <Typography className="processHead">Process Variables</Typography>
              <Divider className="divider1" />
            </section>

            <section className="info">
              <p>
                These are variables for each action in your process. Typically the
                values do not need to be changed.
              </p>
              <p>
                Action Names will appear on the Enablement Station as the worker
                performs the action indicated. Action keys will be used to collect
                the code or tag data. URL validation is used only if validation of
                the code or tag URL is needed.
              </p>
            </section>
            <Divider className="divider1" />
          </>)}



        <section className="stepValidations scroll">
          {/* form list starts */}

          <Form.List name="steps">
            {(fields: any, { add, remove }, { errors }) => (
              <>
                {fields.map((field: any, index: any) => {
                  console.log('field...', stepsData[field?.name]['name']);
                  let name = stepsData[field?.name]['name'];
                  return (
                    <>
                      <div
                        className="step-validation-action"
                        key={index}
                      >
                        <div className="title">
                          <Title level={5}>
                            Step {index + 1} - {name}
                          </Title>
                        </div>
                        <Row>
                          <Col span={4}>
                            <div className="actionIcon">
                              <UIImage src={getActionIcon(name)} />
                            </div>
                          </Col>

                          <Col xs={24} md={24} lg={24} xl={16}>
                            <Row
                              gutter={[14, 14]}
                              style={{ marginBottom: "20px" }}
                            >
                              <Col span={12}>
                                <UIInput
                                  label={"Action Name"}
                                  name={[index, "name"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Action name is required",
                                    },
                                  ]}
                                  disabled={true}
                                />

                                <div style={{ display: "none" }}>
                                  <UIInput
                                    name={[index, "id"]}
                                  />
                                </div>
                              </Col>
                              <Col span={8}>
                                <UIInput
                                  label={"Key"}
                                  name={[index, "key"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Key is required",
                                    },
                                  ]}
                                  disabled={true}
                                />
                              </Col>

                              {/* Scan QR code action fields */}
                              {name === processActions.SCAN_QRCODE && (
                                <>
                                  <Col xs={24} md={24} lg={16} xl={10}>
                                    <div className="d-flex">
                                      {urlValidationQrCode[index] === "regex" && (
                                        <div>
                                          <UITooltip
                                            title={hints.regex}
                                            placement="left"
                                          >
                                            <div className="infoIcon">
                                              <InfoCircleFilled />
                                            </div>
                                          </UITooltip>
                                        </div>
                                      )}
                                      <div className="w-100">
                                        <UISelectInput
                                          label="URL Validation"
                                          name={[index, "urlValidation"]}
                                          className="validationType"
                                          placeholder="Choose URL Validation"
                                          onChange={(value: never) => {
                                            let x = [...urlValidationQrCode];
                                            x[index] = value;
                                            setUrlValidationQrCode(x);
                                            let y: any = [...testStringQrCode];
                                            y[index] = false;
                                            setTestStringQrCode(y);

                                            // clear validation value on change
                                            let steps = [...form.getFieldValue('steps')];
                                            steps[index]['value'] = "";
                                            form.setFieldValue('steps', steps);



                                          }}
                                          optionValue={urlValidationOptions}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "URL Validation is required.",
                                            },
                                          ]}
                                        />
                                      </div>
                                    </div>
                                  </Col>

                                  <Col xs={24} md={24} lg={16} xl={14}>

                                    <div className="validationInputs">
                                      {urlValidationQrCode[index] === "none" ? (
                                        <div className="noneWarningText">
                                          It is recommended to enable validation
                                          in this action.
                                        </div>
                                      )
                                        : urlValidationQrCode[index] !== undefined &&
                                          urlValidationQrCode[index] !== "none" ? (
                                          <>
                                            <UIInput
                                              label={
                                                urlValidationQrCode[index] === "starts"
                                                  ? "Starts With"
                                                  : urlValidationQrCode[index] ===
                                                    "contains"
                                                    ? "Contains"
                                                    : urlValidationQrCode[index] === "regex"
                                                      ? "Regular Expression"
                                                      : ""
                                              }
                                              name={[index, "value"]}
                                              className="validationValue"
                                              placeholder={
                                                urlValidationQrCode[index] === "starts"
                                                  ? "Example: https://www.example.com"
                                                  : urlValidationQrCode[index] ===
                                                    "contains"
                                                    ? "Example: example.com"
                                                    : urlValidationQrCode[index] === "regex"
                                                      ? String.raw`https://www.example.com/\?id=[0-9A-Z]{10}`
                                                      : ""
                                              }
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "This field is required",
                                                },
                                              ]}
                                              onChange={() => {
                                                let x: any = [...testStringQrCode];
                                                x[index] = false;
                                                setTestStringQrCode(x)
                                              }}
                                            />
                                            {!details ?
                                              <UIbutton
                                                type="info"
                                                btnType="button"
                                                size="sm"
                                                className="testBtn"
                                                onPress={() => {
                                                  let x: any = [...testStringQrCode];
                                                  x[index] = !x[index];
                                                  setTestStringQrCode(x)
                                                }}
                                              >
                                                {testStringQrCode[index] ? "CLOSE" : "TEST"}
                                              </UIbutton>
                                              : <></>}
                                          </>


                                        ) : (
                                          ""
                                        )}
                                    </div>
                                  </Col>
                                  {testStringQrCode[index] && <Col span={24}>
                                    <UIInput
                                      label={"Test String"}
                                      placeholder="Enter Test String"
                                      onChange={stringTester}
                                    />
                                    <div className="stringResult"></div>
                                  </Col>}

                                </>
                              )}

                              {/* Scan QR code action fields */}

                              {/* Scan Barcode action fields */}
                              {name === processActions.SCAN_BARCODE && (
                                <>
                                  <Col xs={24} md={24} lg={16} xl={10}>
                                    <div className="d-flex">
                                      {validationBarCode[index] === "regex" && (
                                        <div>
                                          <UITooltip
                                            title={hints.regex}
                                            placement="left"
                                          >
                                            <div className="infoIcon">
                                              <InfoCircleFilled />
                                            </div>
                                          </UITooltip>
                                        </div>
                                      )}

                                      <div className="w-100">

                                        <UISelectInput
                                          label="Validation"
                                          name={[index, "validation"]}
                                          placeholder="Choose Validation"
                                          className="validationType"
                                          optionValue={validationOptions}
                                          onChange={(value: never) => {
                                            let x = [...validationBarCode];
                                            x[index] = value;
                                            setValidationBarCode(x);

                                            let y: any = [...testStringBarcode];
                                            y[index] = false;
                                            setTestStringBarcode(y);

                                            // clear validation value on change
                                            let steps = [...form.getFieldValue('steps')];
                                            steps[index]['value'] = "";
                                            form.setFieldValue('steps', steps);
                                          }}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "Validation is required.",
                                            },
                                          ]}
                                        />
                                      </div>
                                    </div>
                                  </Col>

                                  <Col xs={24} md={24} lg={16} xl={14}>
                                    <div className="validationInputs">
                                      {validationBarCode[index] === "none" ? (
                                        <div className="noneWarningText">
                                          It is recommended to enable validation
                                          in this action.
                                        </div>
                                      ) : validationBarCode[index] === "regex" ? (
                                        <>
                                          <UIInput
                                            label={"Regular Expression"}
                                            className="validationValue"
                                            name={[index, "value"]}
                                            placeholder="Please enter a value for Regular Expression."
                                            rules={[
                                              {
                                                required: true,
                                                message: "This field is required",
                                              },
                                            ]}
                                          />
                                          {!details ?
                                            <UIbutton
                                              type="info"
                                              btnType="button"
                                              size="sm"
                                              className="testBtn"
                                              onPress={() => {
                                                let x: any = [...testStringBarcode];
                                                x[index] = !x[index];
                                                setTestStringBarcode(x)
                                              }}
                                            >
                                              {testStringBarcode[index] ? "CLOSE" : "TEST"}
                                            </UIbutton>
                                            : <></>}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Col>

                                  {testStringBarcode[index] && <Col span={24}>
                                    <UIInput
                                      label={"Test String"}
                                      placeholder="Enter Test String"
                                      onChange={stringTester}
                                    />
                                    <div className="stringResult"></div>
                                  </Col>}
                                </>
                              )}

                              {/* Scan Barcode action fields */}

                              {/* Scan NFC action fields */}

                              {name === processActions.SCAN_NFC && (
                                <>
                                  <Col xs={24} md={24} lg={16} xl={10}>
                                    <div className="d-flex">
                                      {urlValidationNFC[index] === "regex" && (
                                        <div>
                                          <UITooltip
                                            title={hints.regex}
                                            placement="left"
                                          >
                                            <div className="infoIcon">
                                              <InfoCircleFilled />
                                            </div>
                                          </UITooltip>
                                        </div>
                                      )}

                                      <div className="w-100">
                                        <UISelectInput
                                          label="URL Validation"
                                          name={[index, "urlValidation"]}
                                          className="validationType"
                                          placeholder="Choose URL Validation"
                                          onChange={(value: never) => {
                                            let x = [...urlValidationNFC];
                                            x[index] = value;
                                            setUrlValidationNFC(x);

                                            let y: any = [...testStringNFC];
                                            y[index] = false;
                                            setTestStringNFC(y);

                                            // clear validation value on change
                                            let steps = [...form.getFieldValue('steps')];
                                            steps[index]['value'] = "";
                                            form.setFieldValue('steps', steps);
                                          }}
                                          optionValue={urlValidationOptions}
                                          rules={[
                                            {
                                              required: true,
                                              message:
                                                "URL Validation is required.",
                                            },
                                          ]}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                  <Col xs={24} md={24} lg={16} xl={14}>
                                    <div className="validationInputs">
                                      {urlValidationNFC[index] === "none" ? (
                                        <div className="noneWarningText">
                                          It is recommended to enable validation
                                          in this action.
                                        </div>
                                      ) : urlValidationNFC[index] !== undefined &&
                                        urlValidationNFC[index] !== "none" ? (
                                        <>
                                          <UIInput
                                            label={
                                              urlValidationNFC[index] === "starts"
                                                ? "Starts With"
                                                : urlValidationNFC[index] === "contains"
                                                  ? "Contains"
                                                  : urlValidationNFC[index] === "regex"
                                                    ? "Regular Expression"
                                                    : ""
                                            }
                                            name={[index, "value"]}
                                            className="validationValue"
                                            placeholder={
                                              urlValidationNFC[index] === "starts"
                                                ? "Enter starts with string"
                                                : urlValidationNFC[index] ===
                                                  "contains"
                                                  ? "Enter contains string"
                                                  : urlValidationNFC[index] === "regex"
                                                    ? String.raw`https://www.example.com/\?id=[0-9A-Z]{10}`
                                                    : ""
                                            }
                                            rules={[
                                              {
                                                required: true,
                                                message: "This field is required",
                                              }
                                            ]}
                                            onChange={() => {
                                              let x: any = [...testStringNFC];
                                              x[index] = false;
                                              setTestStringNFC(x)
                                            }}
                                          />
                                          {!details ?
                                            <UIbutton
                                              type="info"
                                              btnType="button"
                                              size="sm"
                                              className="testBtn"
                                              onPress={() => {
                                                let x: any = [...testStringNFC];
                                                x[index] = !x[index];
                                                setTestStringNFC(x);
                                              }}
                                            >
                                              {testStringNFC[index] ? "CLOSE" : "TEST"}
                                            </UIbutton>
                                            : <></>}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </Col>

                                  {testStringNFC[index] && <Col span={24}>
                                    <UIInput
                                      label={"Test String"}
                                      placeholder="Enter Test String"
                                      onChange={stringTester}
                                    />
                                    <div className="stringResult"></div>
                                  </Col>}
                                </>
                              )}

                              {/* Scan NFC action fields */}

                              {/* Add Input Field action fields */}

                              {name === processActions.ADD_INPUT && (
                                <Col span={16}>
                                  <UIInput
                                    placeholder="Input Value"
                                    label={"Input Label"}
                                    name={[index, "labelText"]}
                                    rules={[
                                      {
                                        required: true,
                                        message: "This field is required",
                                      },
                                    ]}
                                  />
                                </Col>
                              )}

                              {/* Add Input Field action fields */}

                              {/* Encode UHF action fields */}

                              {name === processActions.ENCODE_UHF && (
                                <>
                                  <Col span={12}>
                                    <UISelectInput
                                      label="Company Prefix"
                                      name={[index, "companyPrefix"]}
                                      disabled={true}
                                      initialValue={"BAR_CODE"}
                                      placeholder="Select.."
                                      optionValue={encodeUHFOptions}
                                      rules={[
                                        {
                                          required: true,
                                          message: "This field is required.",
                                        },
                                      ]}
                                    />
                                  </Col>

                                  <Col span={12}>
                                    <UISelectInput
                                      label="Item Reference"
                                      name={[index, "itemReference"]}
                                      placeholder="Select.."
                                      disabled={true}
                                      initialValue={"BAR_CODE"}
                                      optionValue={encodeUHFOptions}
                                      rules={[
                                        {
                                          required: true,
                                          message: "This field is required.",
                                        },
                                      ]}
                                    />
                                  </Col>

                                  <Col span={12}>
                                    <UISelectInput
                                      label="Serial Number"
                                      name={[index, "serialNumber"]}
                                      placeholder="Select.."
                                      optionValue={[
                                        { text: "TID", value: "tid" },
                                        {
                                          text: "Random Number",
                                          value: "randomNo",
                                        },
                                      ]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "This field is required.",
                                        },
                                      ]}
                                    />
                                  </Col>
                                  <Col span={12}>
                                    <div className="customLabel">Lock Tag</div>
                                    <Form.Item name={[index, "lockTag"]} valuePropName="checked">
                                      <Checkbox checked={true}>
                                        Make tag read-only
                                      </Checkbox>
                                    </Form.Item>

                                  </Col>
                                </>
                              )}

                              {/* Encode UHF action fields */}

                              {/* Encode NFC action fields */}

                              {name === processActions.ENCODE_NFC && (
                                <>
                                  <Col span={12}>
                                    <div className="d-flex align-items-center">
                                      <UITooltip
                                        title={hints.encodeNfcUrl}
                                        placement="left"
                                      >
                                        <div className="infoIcon">
                                          <InfoCircleFilled />
                                        </div>
                                      </UITooltip>
                                      <div className="w-100">
                                        <UIInput
                                          placeholder="https://example.com/tap?id={tagId}&foo=bar"
                                          label={"URL"}
                                          name={[index, "url"]}
                                          rules={[
                                            {
                                              required: true,
                                              message: "This field is required",
                                            },
                                            {
                                              pattern: new RegExp(Regex?.VALID_URL),
                                              message: "Please enter valid URL"
                                            }
                                          ]}
                                        />
                                      </div>
                                    </div>
                                  </Col>

                                  <Col span={12}>
                                    <div className="customLabel">Lock Tag</div>
                                    <Form.Item name={[index, "lockTag"]} valuePropName="checked">
                                      <Checkbox checked={true}>
                                        Make tag read-only
                                      </Checkbox>
                                    </Form.Item>

                                  </Col>
                                </>
                              )}

                              {/* Encode NFC action fields */}
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </>
                  )
                })}
              </>
            )}
          </Form.List>

          {/* form list ends */}
        </section>
      </section>

    </>
  );
};