import { Col, Form, Row, message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useState } from "react";
import { apiRoutes, baseURL } from "../../../../../config/api";
import { Regex } from "../../../../../config/constants";
import { UIInput } from "../../../../common/input";
import { UISelectInput } from "../../../../common/selectInput";
import TextArea from "../../../../common/textArea";
import { UIErrorAlert } from "../../../../common/uiAlert";
import { UIProfilePicUploader } from "../../../../common/uploader";

export const ZoneForm = (props: any) => {
  const {
    onModalSubmit,
    form,
    error,
    formValues,
    setFormValues,
    id,
    formData,
    setFormData,
    zoneTypeOption,
    siteId,
    siteName,
    roles,
  } = props;


  const [sitename, setSitename] = useState("")
  const [loading, setLoading] = useState(false);
  const handleChange = (Event: any) => {
    if (id == "addZone") {
      setFormValues({
        ...formValues,
        [Event.target.name]: Event.target.value,
      })
    } else {
      setFormData({
        ...formData,
        [Event.target.name]: Event.target.value,
      });
    }
  };
  const onZoneTypeSelect = (value: any) => {
    if (id == "addZone") {
      setFormValues({
        ...formValues,
        zoneType: value
      })
    } else {
      setFormData({ ...formData, zoneType: value })
    };
  };

  return (
    <Form
      id={id}
      key={siteName}
      form={form}
      className="modalForm"
      layout="vertical"
      onFinish={onModalSubmit}
    >
      {error && (
        <div className="pb-10">
          <UIErrorAlert>{error}</UIErrorAlert>
        </div>
      )}

      <Row gutter={10}>
        <Col span={12}>
          <UIInput
            label="Zone Name"
            placeholder="Enter Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter name",
              },
              {
                pattern: new RegExp(Regex.VALID_NAME),
                message: "Zone name should have 3 to 50 character"
              }
            ]}
            // initialValue={formValues.name}
            value={formValues.name}
            onChange={handleChange}
          />
        </Col>
        <Col span={12}>
          <UIInput
            label="Sites"
            placeholder="Select Sites"
            name="siteName"
            disabled={true}
            defaultValue={siteName}
            value={siteName}
            onChange={handleChange}
          />
        </Col>
        <Col span={24} className="inputCss">
          <UISelectInput
            label="Zone Type"
            placeholder="Select Zone Type"
            name="zoneType"
            rules={[
              {
                required: true,
                message: "Please select Zone Type",
              },
            ]}
            // initialValue={formValues.zoneType}
            // value={formValues.zoneType}
            onChange={onZoneTypeSelect}
            optionValue={zoneTypeOption}
          />
        </Col>
        <Col span={24} className="inputCss">
          <TextArea
            label="Description"
            placeholder="Enter Description"
            name="description"
            rules={[
              {
                required: false,
                message: "Please enter description",
              },
              {
                pattern: new RegExp(Regex.VALID_DESCRIPTION),
                message: "Description should have maximum 250 characters."
              }
            ]}
            // initialValue={formValues.description}
            value={formValues.description}
            onChange={handleChange}
          ></TextArea>
        </Col>
      </Row>
    </Form>
  );
};
