import { Col, Form, message, Row } from "antd"
import { useEffect, useState } from "react"
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface"; 
import { uploadImage } from "../../../../assets/images"
import { UIImage } from "../../../common/image"
import { UIInput } from "../../../common/input"
import TextArea from "../../../common/textArea"
import { UIProfilePicUploader } from "../../../common/uploader";
import { apiRoutes, baseURL } from "../../../../config/api";
import { Regex } from "../../../../config/constants";

export const TenantForm = (props:any) => {
    const {onModalSubmit, form, formValues, setFormValues, id} = props;
    const [loading, setLoading] = useState(false);
    const [logo, setlogo] = useState<string>();

    const handleChange = (Event: any) => {
      setFormValues({
        ...formValues,
        [Event.target.name]: Event.target.value,
      });
    };

    const handleUploadChange: UploadProps["onChange"] = (
      info: UploadChangeParam<UploadFile>
    ) => {
      if (info?.file?.status === "uploading") {
        setLoading(true);
        return;
      }
      if (info?.file?.status === "done" && info?.file?.response?.statusCode) {
        setLoading(false);
        setlogo(info?.file?.response?.result);
        setFormValues({
          ...formValues,
          logo: info?.file?.response?.result,
        });
      }
    };
  
    return(
        <Form
        id={id}
        form={form}
        className="modalForm"
        layout="vertical"
        onFinish={onModalSubmit}
      >
      
        <Row>
          <Col>
          <UIProfilePicUploader
            name="profile"
            action={baseURL + apiRoutes.USER_PROFILE_IMAGE}
            onChange={handleUploadChange}
            loading={loading}
            imageUrl={formValues.logo 
              // || logo
            }
            avatarText={formValues.username}
          /></Col>
          <Col span={24} className="inputCss">
            <UIInput
            id="tenantName"
              label="Name"
              placeholder="Enter Tenant Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter name",
                },
                {
                  pattern:new RegExp(Regex.VALID_NAME),
                  message:"Name should have 3 to 50 character"
                }
              ]}
              // initialValue={formValues.name}
              value={formValues.name}
              onChange={handleChange}
            ></UIInput>
          </Col>
          <Col span={24} className="inputCss">
            <TextArea
              customInput="description-box"
              label="Description"
              placeholder="Enter Tenant Description"
              name="description"
              rules={[
                {
                  required: false,
                  message: "Please enter description",
                },
                {
                  pattern:new RegExp(/^[A-Za-z0-9@$!%*?&,.#><|~{}():;"'/_\s\S=+-]{0,250}$/),
                  message: "Description can not contain more than 250 characters "
                }
              ]}
              initialValue={formValues.description}
              value={formValues.description}
              onChange={handleChange}
            ></TextArea>
          </Col>
        </Row>
      </Form>
    )
}
