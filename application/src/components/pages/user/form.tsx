import { Col, Form, Row } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { apiRoutes, baseURL } from "../../../config/api";
import { Regex } from "../../../config/constants";
import { UIcheckbox } from "../../common/checkbox";
import { UIInput } from "../../common/input";
import { UISelectInput } from "../../common/selectInput";
import { UIErrorAlert } from "../../common/uiAlert";
import { UIProfilePicUploader } from "../../common/uploader";

export const UserForm = (props: any) => {
  let {
    onModalSubmit,
    form,
    error,
    setError,
    formValues,
    setFormValues,
    formId,
    siteOptions,
    isAddModalVisible,
    inputKey,
    usernameDisable,
    setUsernameDisable,
    roles,
    imageUrl,
    setImageUrl,
    checked,
    setChecked,
  } = props;

  console.log("formvalues", formValues);

  const [loading, setLoading] = useState(false);
  // const [checked, setChecked] = useState(false);
  // const [imageUrl, setImageUrl] = useState<string>();
  // const [usernameDisable, setUsernameDisable] = useState(false);
  const handleChange = (Event: any) => {
    setFormValues({
      ...formValues,
      [Event.target.name]: Event.target.value,
    });
  };

  //filter role options
  roles = roles.filter((x: any) => {
    if (formValues.roleName === "Platform Super Admin") {
      return x.text === "Platform Super Admin";
    } else {
      return x.text !== "Platform Super Admin";
    }
  });

  const onRoleSelect = (value: any) => {
    setFormValues({ ...formValues, roleId: value });
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

  const getHomeSiteOptions = () => {
    let homeSiteOption: any[] = siteOptions?.filter((sites: any) =>
      formValues?.siteId?.some((id: any) => id == sites?.value)
    );
    return homeSiteOption;
  };

  const onUserNameCheck = (e: any) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      form.setFieldsValue({
        username: formValues.email,
      });
      setFormValues({ ...formValues, username: formValues.email });
      setUsernameDisable(true);
    } else {
      form.setFieldsValue({
        username: ""
      });
      setFormValues({ ...formValues, username: "" });
      setUsernameDisable(false);
    }
  };

  useEffect(() => {
    setChecked(false);
    setUsernameDisable(false);
  }, [formValues?.email]);

  const handleSiteChange = (value: any) => {
    form.setFieldValue("homeSite", null);
    setFormValues({ ...formValues, siteId: value });
  };

  const onHomeSiteChange = (value: any) => {
    setFormValues({ ...formValues, homeSite: value });
  };

  return (
    <Form
      id={formId}
      form={form}
      key="userForm"
      className="modalForm"
      layout="vertical"
      onFinish={() => {
        onModalSubmit();
      }}
    >
      {/* {error && (
        <div className="pb-10">
          <UIErrorAlert showAlert={error} setShowAlert={setError}>
            {error}
          </UIErrorAlert>
        </div>
      )}
   */}
      <Row gutter={10}>
        <Col>
          <UIProfilePicUploader
            name="profile"
            action={baseURL + apiRoutes.USER_PROFILE_IMAGE}
            onChange={handleUploadChange}
            loading={loading}
            imageUrl={
              formValues.imageUrl
              // || imageUrl
            }
            avatarText={formValues.username}
          />
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={12} className="inputCss">
          <UIInput
            label="Name"
            placeholder="Enter Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter name",
              },
              {
                pattern: new RegExp(Regex.VALID_NAME),
                message: "Name should have 3 to 50 character",
              },
            ]}
            // initialValue={formValues.name}
            value={formValues.name}
            onChange={handleChange}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UISelectInput
            label="Role"
            placeholder="Select Role"
            name="roleId"
            rules={[
              {
                required: true,
                message: "Please select role",
              },
            ]}
            optionValue={roles}
            // initialValue={formValues.roleId}
            // value={formValues.roleId}
            onChange={onRoleSelect}
          />
        </Col>

        <Col span={12} className="inputCss">
          <UIInput
            label="Email"
            placeholder="Enter Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email",
              },
              {
                // pattern: new RegExp(Regex.VALID_EMAIL),
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
            // initialValue={formValues.email}
            value={formValues.email}
            onChange={handleChange}
          />
        </Col>
        <Col span={12} className="inputCss usernameInput">
          {formId === "addUser" && (
            <div className="useEmailCheckBox">
              <UIcheckbox
                key={formValues.email + formValues.username}
                onChange={onUserNameCheck}
                checked={checked}
                disabled={usernameDisable}
              >
                Use email
              </UIcheckbox>
            </div>
          )}

          <UIInput
            label="Username"
            placeholder="Enter Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please enter username",
              },
              {
                pattern: new RegExp(Regex.VALID_USERNAME),
                message: "Please enter a valid username",
              },
            ]}
            // initialValue={formValues.username}
            value={formValues.username}
            onChange={handleChange}
            disabled={usernameDisable || formId === "editUser" ? true : false}
          />
        </Col>
        {inputKey ? null : (
          <>
            <Col span={12} className="inputCss">
              <UISelectInput
                label="Sites"
                placeholder="Select Sites"
                mode="multiple"
                name="siteId"
                rules={[
                  {
                    required: true,
                    message: "Please select sites",
                  },
                ]}
                // value={formValues?.userRole?.siteId}
                onChange={handleSiteChange}
                optionValue={siteOptions}
              />
            </Col>
            <Col span={12} className="inputCss">
              <UISelectInput
                label="Home Site"
                placeholder="Select Home Site"
                name="homeSite"
                rules={[
                  {
                    required: true,
                    message: "Please select Home Site",
                  },
                ]}
                // value={formValues?.userRole?.homeSite}
                optionValue={getHomeSiteOptions()}
                onChange={onHomeSiteChange}
              />
            </Col>
          </>
        )}
      </Row>
    </Form>
  );
};
