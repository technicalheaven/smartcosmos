import { LoadingOutlined } from "@ant-design/icons";
import { Card, Checkbox, Col, Form, message, Row, Space, Spin } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  envTag,
  newCosmosCircle,
  scblackTextLogo,
} from "../../../assets/images/index";
import { config } from "../../../config";
import { Regex } from "../../../config/constants";
import { ModalTitle } from "../../../config/enum";
import {
  setAuthInfo,
  setLogin,
  setPermissions,
} from "../../../redux/features/auth/authSlice";
import {
  useForgotPasswordSendMailMutation,
  useLoginMutation,
} from "../../../redux/services/authApiSlice";
import { useGetRoleDetailMutation } from "../../../redux/services/roleApiSlice";
import { Page } from "../../../routes/config";
import { UIbutton, UIsecondaryButton } from "../../common/button";
import { UIInput, UIInputPassword } from "../../common/input";
import { UIModal } from "../../common/modal";
import { UIErrorAlert } from "../../common/uiAlert";
import "./style.css";

export const Login = () => {
  //states
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [checked, setChecked] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [forgotPassword, setForgotPassword] = useState<any>({
    email: "",
  });
  const [errorAlert, setErrorAlert] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [disableReset, setDisableReset] = useState(true);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //API
  const [userLogin, userLoginData] = useLoginMutation();
  const [fetchRolePermissions, rolePermissionsInfo] =
    useGetRoleDetailMutation();

  useEffect(() => {
    const username = getCookie("username");
    const password = getCookie("password");
    if (username !== "" && password !== "") {
      form.setFieldsValue({ username, password });
      setCredentials({ username, password });
    }
  }, []);

  useEffect(() => {
    if (rolePermissionsInfo?.isSuccess) {
      const permissions =
        rolePermissionsInfo?.data?.result?.message?.permission;
      dispatch(setPermissions(permissions));
      dispatch(setLogin(true));
    }
  }, [rolePermissionsInfo?.isSuccess]);

  useEffect(() => {
    if (userLoginData?.isSuccess) {
      const { accessToken, idToken, refreshToken, tenantInfo, userInfo } =
        userLoginData?.data?.result;

      // setting auth state
      dispatch(
        setAuthInfo({
          userInfo,
          accessToken,
          idToken,
          refreshToken,
          userId: userInfo?.userRole?.userId,
          tenantInfo,
          isPlatformRole: userInfo?.userRole?.isPlatformRole,
        })
      );

      fetchRolePermissions(userInfo?.userRole?.roleId);
    }
  }, [userLoginData?.isSuccess]);

  useEffect(() => {
    if (userLoginData?.error?.status == 500) {
      message.error("Something Went Wrong");
    }
    else if (userLoginData?.isError) {
      setLoginError(true);
    }
  }, [userLoginData?.isError]);

  const [forgotPasswordReq, forgotPasswordInfo] =
    useForgotPasswordSendMailMutation();
  useEffect(() => {
    if (forgotPasswordInfo?.isSuccess) {
      message.success("Email sent Successfully");
      setIsModalVisible(false);
    }
  }, [forgotPasswordInfo?.isSuccess]);

  useEffect(() => {
    if (forgotPasswordInfo?.isError) {
      setErrorAlert(true);
    }
  }, [forgotPasswordInfo?.isError]);

  const showAlert = () => {
    if (forgotPasswordInfo?.isError) {
      return (
        <UIErrorAlert
          message={forgotPasswordInfo?.error?.data?.error?.message}
          showAlert={errorAlert}
          setShowAlert={setErrorAlert}
          type="error"
        ></UIErrorAlert>
      );
    }
  };

  //functions
  const onFinish = (values: any) => {
    console.log("sign in function", credentials, values);

    userLogin(credentials);
  };

  const handleChange = (Event: any) => {
    setErrorAlert(false);
    setLoginError(false);
    setCredentials({
      ...credentials,
      [Event.target.name]: Event.target.value,
    });
  };
  const onModalClose = () => {
    setIsModalVisible(!isModalVisible);
    form1.resetFields();
    setDisableReset(true);
  };
  const onModalSubmit = (values: any) => {
    forgotPasswordReq(forgotPassword);
    setDisableReset(true);
    form1.resetFields();
  };
  const onEmailChange = (Event: any) => {
    setForgotPassword({
      ...forgotPassword,
      [Event.target.name]: Event.target.value,
    });
    setDisableReset(false);
  };
  const onResetClick = () => {
    form1.resetFields();
    setDisableReset(true);
  };

  const setCookieData = () => {
    const username = credentials?.username ?? "";
    const password = credentials?.password ?? "";
    if (username.trim() == "" || password.trim() == "") {
      message.error("Please enter username and password");
      setChecked(false);
      return false;
    }
    document.cookie = `username=${username}; path=/login`;
    document.cookie = `password=${password}; path=/login`;
  };

  useEffect(() => {
    if (checked) {
      setCookieData();
    }
  }, [checked]);

  function getCookie(name: any) {
    const value: any = `; ${document.cookie}`;
    const parts: any = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const showError = () => {
    if (loginError) {
      return (
        <Row className="errorLogin">
          <Col span={24}>
            <p className="errorMessage">
              {userLoginData.error?.data?.error?.message}
            </p>
          </Col>
        </Row>
      );
    }
  };

  return (
    <div className="mainDiv">
      <Card className="Card" bordered={false}>
        <div className="envTag">
          <figure>
            <img data-testid="envTag" src={envTag} />
            <figcaption className="envText">{config.ENV}</figcaption>
          </figure>
        </div>
        <Row>
          <Col span={24} className="logoDiv ">
            <img
              className="cosmosCircle"
              data-testid="mainLogo"
              width="160px"
              src={newCosmosCircle}
              alt="the alt text"
            />
          </Col>
          <Col span={24} className="logoDiv ">
            <img
              className="smallLogo"
              data-testid="mainLogo"
              width="160px"
              src={scblackTextLogo}
              alt="the alt text"
            />
          </Col>
        </Row>
        <div className="cardDiv">
          <p data-testid="text" className="heading">
            Sign in to the portal
          </p>
          <Form
            form={form}
            className="mainForm"
            layout="vertical"
            onFinish={onFinish}
          >
            <Row>
              <Col span={24}>
                <Row className="inputCss">
                  <Col span={24}>
                    <UIInput
                      label="Username"
                      placeholder="Enter Username"
                      name="username"
                      className="userInput"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your username",
                        },
                        {
                          pattern: new RegExp(/^\S{6,}$/),
                          message: "Please enter a valid username",
                        },
                      ]}
                      value={credentials.username}
                      onChange={handleChange}
                    ></UIInput>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Row className="inputCss">
                  <Col span={24}>
                    <UIInputPassword
                      label="Password"
                      placeholder="Enter Password"
                      name="password"
                      type="password"
                      className="password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your password",
                        },
                        {
                          pattern: new RegExp(Regex.PASSWORD_VALID_LENGTH),
                          message: "Please enter a valid password",
                        },
                      ]}
                      value={credentials.password}
                      onChange={handleChange}
                    ></UIInputPassword>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className="checkboxRow">
              <Col span={13}>
                <Checkbox
                  data-testid="checkbox"
                  checked={checked}
                  onChange={() => {
                    setChecked(!checked);
                  }}               
                  className="rememberMe"
                >
                  Remember me
                </Checkbox>
              </Col>
              <Col span={11} className="forgotPass">
                <span
                  className="forgetPassword"
                  onClick={() => setIsModalVisible(true)}
                  data-testid="forgotPassword"
                >
                  Forgot Password?
                </span>
              </Col>
            </Row>
            <div className="loginErrorMessageHeight">
            {showError()}
            </div>
            <Row className="signIn">
              <Col span={24}>
                <UIbutton
                  type="info"
                  btnType="submit"
                  size="xl"
                  className="signInBtn"
                >
                  {userLoginData.isLoading && (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 20,
                            color: "#fff",
                            marginRight: "10px",
                          }}
                          spin
                        />
                      }
                    />
                  )}
                  SIGN IN
                </UIbutton>
              </Col>
            </Row>
          </Form>
        </div>
      </Card>
      <UIModal
        title={ModalTitle.FORGOT_PASSWRD}
        data-testid="forgotModal"
        visible={isModalVisible}
        // handleCancel={onModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIsecondaryButton
              disableBtn={disableReset}
              onPress={onResetClick}
              size="sm"
            >
              RESET
            </UIsecondaryButton>
            <UIbutton
              form="forgotPassword"
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
            >
              SUBMIT
            </UIbutton>
          </Space>,
        ]}
      >
        {showAlert()}
        <div className="modalMainDiv">
          <Form
            id="forgotPassword"
            form={form1}
            className="modalForm"
            layout="vertical"
            onFinish={onModalSubmit}
          >
            <Row>
              <Col span={24}>
                <UIInput
                  label="Email"
                  placeholder="Enter your registered email to receive reset password link"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email",
                    },
                    {
                      // pattern: new RegExp(Regex.VALID_EMAIL),
                      type: "email",
                      message: "Please enter a valid email",
                    },
                  ]}
                  onChange={onEmailChange}
                ></UIInput>
              </Col>
            </Row>
          </Form>
        </div>
      </UIModal>
    </div>
  );
};

export default Login;
