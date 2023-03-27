import { Col, Form, Row, message, Space } from "antd";
import { useEffect, useState } from "react";
import { Regex } from "../../../config/constants";
import { useChangePasswordMutation } from "../../../redux/services/authApiSlice";
import { UIbutton, UIsecondaryButton } from "../../common/button";
import { UIInputPassword } from "../../common/input";
import { UILoader } from "../../common/loader";
import { UIModal } from "../../common/modal";

const ResetPasswordModal = ({
  title,
  isModalVisible,
  setIsModalVisible,
  data: userData,
  type,
  userQuery
}: any) => {
  //states

  const [confirmPasswordModal, setConfirmPasswordModal] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loader, setLoader] = useState(false);
  const getErrorMessage = (data: any) => {
    if (data?.error) {
      return data?.error?.message;
    } else if (data?.errors) {
      return data?.errors[0]?.msg;
    } else {
      return "something went wrong";
    }
  };
  //API integration
  const [changePassword, changePasswordInfo] = useChangePasswordMutation();
  useEffect(() => {
    // console.log('change password response', changePasswordInfo);
    setLoader(false);
    if (changePasswordInfo.isSuccess) {
      const { data } = changePasswordInfo;
      if (data.statusCode) {
        message.success({
          content: `Password changed successfully.`,
          // className:"successMessage"
        });
        form.resetFields();
        setIsModalVisible(false);
      }
      userQuery?.refetch()
    } else if (changePasswordInfo?.isError) {
      const { error } = changePasswordInfo;
      message.error({
        content: getErrorMessage(error?.data),
        key: "notificationKey",
      });
    }
  }, [changePasswordInfo?.isSuccess, changePasswordInfo?.isError]);

  const [form] = Form.useForm();
  //functions
  const onModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onModalSave = ({ newPassword, currentPassword }: any) => {
    setLoader(true);
    changePassword({
      username: userData?.username,
      password: newPassword,
      currentPassword: currentPassword,
    });
  };

  const onpasswordChange = (Event: any) => {
    setConfirmPasswordModal({
      ...confirmPasswordModal,
      [Event.target.name]: Event.target.value,
    });
  };

  const enableInput = () => {
    if (!confirmPasswordModal?.newPassword?.length) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <UIModal
      title={title}
      visible={isModalVisible}
      // handleCancel={onModalClose}
      footer={[
        <Space>
          <UIsecondaryButton onPress={onModalClose} size="sm">
            CANCEL
          </UIsecondaryButton>
          <UIbutton form="confirmPassword" type="info" htmlType="submit">
            SAVE
          </UIbutton>
        </Space>,
      ]}
    >
      <div className="modalMainDiv">
        {loader && <UILoader />}
        <Form
          id="confirmPassword"
          form={form}
          className="modalForm"
          layout="vertical"
          onFinish={onModalSave}
        >
          <Row>
            {type !== "resetPassword" && (
              <Col span={24}>
                <UIInputPassword
                  label="Current Password"
                  placeholder="Enter Current Password"
                  name="currentPassword"
                  type="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the password",
                    },
                  ]}
                  onChange={onpasswordChange}
                ></UIInputPassword>
              </Col>
            )}

            <Col className="columnPassword" span={24}>
              <UIInputPassword
                label="New Password"
                placeholder="Enter New Password"
                name="newPassword"
                type="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter the password",
                  },
                  {
                    pattern: new RegExp(Regex.PASSWORD),
                    message:
                      "Password must be a combination of alphabets, numbers, special characters and minimum 8 chracters",
                  },
                ]}
                value={confirmPasswordModal.newPassword}
                onChange={onpasswordChange}
              />
            </Col>
            <Col className="columnPassword" span={24}>
              <UIInputPassword
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                name="confirmPassword"
                type="password"
                disabled={enableInput()}
                value={confirmPasswordModal.confirmPassword}
                rules={[
                  confirmPasswordModal?.confirmPassword?.length
                    ? {
                        message: "Password does not match",
                        validator: (_: any, value: any) => {
                          if (confirmPasswordModal.newPassword == value) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match");
                          }
                        },
                      }
                    : {
                        required: true,
                        message: "Please enter the password",
                      },
                ]}
                onChange={onpasswordChange}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </UIModal>
  );
};

export default ResetPasswordModal;
