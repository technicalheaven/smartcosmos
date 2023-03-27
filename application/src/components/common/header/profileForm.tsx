import { Select, Form, Row, Col, Input } from "antd";
import { useState } from "react";
import { apiRoutes, baseURL } from "../../../config/api";
import { UIProfilePicUploader } from "../uploader";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { Roles } from "../../../config/enum";
import { Regex } from "../../../config/constants";

export const ProfileForm = (props: any) => {
  const {
    formValues,
    setFormValues,
    form,
    userData,
    id,
    onModalSubmit,
    homeSiteData,
    siteOption,
  } = props;
  console.log(homeSiteData?.result[0]?.name, formValues, "home>");

  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { Option } = Select;
  console.log(siteOption, "option");

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
      setImageUrl(info?.file?.response?.result);
      setFormValues({
        ...formValues,
        imageUrl: info?.file?.response?.result,
      });
    }
  };
  const handleSelectChange = (val: any) => {
    console.log(val, "home");
    setFormValues({
      ...formValues,
      userRole: { ...formValues?.userRole, homeSite: val },
    });

    form.setFieldValue({ homeSite: val });
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        id={id}
        data-testid="form-id"
        initialValues={formValues}
        onFinish={onModalSubmit}
      >
        <Row gutter={10}>
          <Col>
            <UIProfilePicUploader
              name="profile"
              action={baseURL + apiRoutes.USER_PROFILE_IMAGE}
              onChange={handleUploadChange}
              loading={loading}
              imageUrl={formValues.imageUrl || imageUrl}
              avatarText={formValues.username}
            />
          </Col>
        </Row>
        <Row className="inputCss">
          <Col span={24} data-testid="input-id">
            <Form.Item
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter username",
                },
              ]}
              name="username"
              initialValue={formValues?.username}
              className="inputBox-0"
              normalize={(value) => {
                if (value.trim() === "") {
                  return "";
                } else {
                  return value.replace(/  +/g, " ");
                }
              }}
            >
              <Input
                name="username"
                placeholder="Username"
                onChange={handleChange}
                value={formValues?.username}
                className="inputBox-1"
                disabled={true}
              ></Input>
            </Form.Item>
          </Col>
          <Col span={24} className="input-field">
            <Form.Item
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address",
                },
                {
                  // pattern: new RegExp(Regex.VALID_EMAIL),
                  type: "email",
                  message: "Please enter a valid email",
                },
              ]}
              name="email"
              // initialValue={formValues?.email}
              className="inputBox-0"
            >
              <Input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={formValues?.email}
                className="inputBox-1"
              ></Input>
            </Form.Item>
          </Col>
          <Col span={24} className="input-field">
            <Form.Item
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Please enter your name",
                },
                {
                  pattern: new RegExp(Regex.VALID_NAME),
                  message: "Name should have 3 to 50 character",
                },
              ]}
              name="name"
              // initialValue={formValues?.name}
              className="inputBox-0"
              normalize={(value) => {
                if (value.trim() === "") {
                  return "";
                } else {
                  return value.replace(/  +/g, " ");
                }
              }}
            >
              <Input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                value={formValues?.name}
                className="inputBox-1"
              ></Input>
            </Form.Item>
          </Col>
          <Col span={24} className="input-field">
            <Form.Item
              label="Role"
              name="type"
              initialValue={
                formValues?.userRole?.roleName
                  ? formValues?.userRole?.roleName
                  : formValues?.roleName
              }
              className="ib-0"
            >
              <Select disabled={true} className="custom" />
            </Form.Item>
          </Col>

          {userData?.userRole?.roleName === Roles?.PLATFORM_SUPER_ADMIN ||
          userData?.userRole?.roleName === Roles?.PLATFORM_ADMIN ||
          userData?.roleName === Roles?.PLATFORM_SUPER_ADMIN ||
          userData?.roleName === Roles?.PLATFORM_ADMIN ? null : (
            <Col span={24} className="input-field">
              <Form.Item
                label="Home-Site"
                name="homeSite"
                initialValue={homeSiteData?.result[0]?.name}
                className="ib-0"
              >
                <Select
                  placeholder="Home-Site"
                  // rules={[
                  //     {
                  //         required: true,
                  //         message: "Please enter home-site",
                  //     }]}
                  onChange={handleSelectChange}
                  value={homeSiteData?.result[0]?.name}
                  className="custom"
                >
                  {siteOption?.map((option: any, index: any) => {
                    return (
                      <Option value={option?.value} className="options">
                        {option?.text}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>
    </>
  );
};
