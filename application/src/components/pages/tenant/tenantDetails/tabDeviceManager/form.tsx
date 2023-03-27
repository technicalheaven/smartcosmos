import { Col, Form, Radio, Row } from "antd";
import { set } from "immer/dist/internal";
import { Regex } from "../../../../../config/constants";
import { UIInput } from "../../../../common/input";
import TextArea from "../../../../common/textArea";

export const DeviceManagerForm = (props: any) => {
  const { onModalSubmit, setFormValues, formValues, id, form, uuidDisable, setUuidDisable } = props;
  const handleChange = (Event: any) => {
    setFormValues({
      ...formValues,
      [Event.target.name]: Event.target.value,
    });
  };
  const onChange = (Event: any) => {
    setFormValues({
      ...formValues,
      ["type"]: Event.target.value,
    });
  };

  return (
    <>
      <Form layout="vertical" onFinish={onModalSubmit} id={id} form={form}>
        <Row>
          <Col span={24}>
            <UIInput
              label="Name"
              placeholder="Enter Device Manager Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter Device Name",
                },
                {
                  pattern: new RegExp(Regex.VALID_NAME),
                  message: "Device Manager name should have 3 to 50 character"
                }
              ]}
              onChange={handleChange}
            />
          </Col>
          <Col span={24} className="inputCss">
            <UIInput
              label="UUID"
              placeholder="Enter UUID"
              name="uuid"
              rules={[
                {
                  required: true,
                  message: "Please enter UUID",
                },
                {
                  pattern: new RegExp(Regex.VALID_UUID),
                  message: "UUID should have maximum 36 character"
                }
              ]}
              disabled={uuidDisable}
              onChange={handleChange}
            />
          </Col>

          <Col span={24} className="inputCss">
            <UIInput
              label="URL"
              placeholder="Enter URL"
              name="url"
              rules={[
                {
                  required: true,
                  message: "Please enter URL",
                },
                {
                  pattern: new RegExp(Regex?.VALID_URL),
                  message: "Please enter valid URL"
                }
              ]}
              onChange={handleChange}
            />
          </Col>
          <Col span={24} className="inputCss">
            <div className="rdAddpatient">
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please select Active Sessions",
                  },
                ]}
              // initialValue={formValues.type}

              >
                {/* <div className=""> */}
                <Radio.Group name="type" onChange={onChange} defaultValue={formValues.type} value={formValues.type}>
                  <Radio value="onCloud" defaultChecked={false}>On Cloud</Radio>
                  <Radio value="onPremise" defaultChecked={false}>On Premise</Radio>
                </Radio.Group>
                {/* </div> */}
              </Form.Item>
            </div>
          </Col>

          <Col span={24} className="inputCssManager">
            <TextArea
              label="Description"
              placeholder="Description"
              name="description"
              onChange={handleChange}
              className="description"
              rules={[{
                pattern: new RegExp(Regex.VALID_DESCRIPTION),
                message: "Description should have maximum 250 characters."
              }]}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
};
