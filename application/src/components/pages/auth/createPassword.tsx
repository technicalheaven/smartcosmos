import { UIInputPassword } from "../../common/input";
import "./style.css";
import { newCosmosCircle, scblackTextLogo, smartCosmosLogo } from "../../../assets/images";
import { UIImage } from "../../common/image";
import { UIButtonBlock } from "../../common/button";
import { useEffect, useState } from "react";
import { Col, Form, message, Row } from "antd";
import { useForgotPasswordMutation } from "../../../redux/services/authApiSlice";
import { Regex } from "../../../config/constants";
import { useNavigate } from "react-router-dom";
import { Page } from "../../../routes/config";
import { setLogin } from "../../../redux/features/auth/authSlice";
import { useDispatch } from "react-redux";


const CreatePassword = () => {
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });

const [forgetPassword, forgetPasswordInfo] = useForgotPasswordMutation();
const navigate = useNavigate();

  const onSubmit = () => {
    const token = new URLSearchParams(window.location.search).get('token');
    if(!token){
      message.error('Token not present in URL');
      return;
    }
    const { password } = formValues;
    forgetPassword({token, password, email: true});
  };
  
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const enableInput = () => {
    if (!formValues?.password?.length) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(()=>{
    if(forgetPasswordInfo.isSuccess){
    message.success('Password created successfully!');
    dispatch(setLogin(false));
    navigate(Page.HOME);
    }
  },[forgetPasswordInfo.isSuccess])
  useEffect(()=>{
    if(forgetPasswordInfo?.isError){
     console.log(forgetPasswordInfo,"jjjj");
     message.error(forgetPasswordInfo?.error?.data?.error?.message)
    }
  },[forgetPasswordInfo.isError])

  return (
    <section className="createPassword">
      <div className="box">
        <div className="content">
          <div className="logo">
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
            {/* <UIImage src={scblackTextLogo} alt="logo" /> */}
          </div>
          <div className="text">
            Welcome to Smart cosmos!
            <br />
            Please sign in by selecting a password.
          </div>

          <Form
          id="changePasswordForm"
          form={form}
          className="modalForm"
          layout="vertical"
          onFinish={onSubmit}
        >
          <Row>
 
            <Col span={24}>
              <UIInputPassword
                label="Password"
                placeholder="Enter New Password"
                name="password"
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
                value={formValues.password}
                onChange={(e:any)=>{setFormValues({...formValues,password: e.target.value})}}
              />
            </Col>
            <Col span={24}>
              <UIInputPassword
                label="Confirm Password"
                placeholder="Enter Confirm Password"
                name="confirmPassword"
                type="password"
                disabled={enableInput()}
                value={formValues.confirmPassword}
                rules={[
                  formValues?.confirmPassword?.length
                    ? {
                        message: "Password does not match",
                        validator: (_: any, value: any) => {
                          if (formValues.password == value) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Password does not match");
                          }
                        },
                      }
                    : {
                        required: true,
                        message: "Please enter the confirm password",
                      },
                ]}
                onChange={(e:any)=>{setFormValues({...formValues,confirmPassword: e.target.value})}}
              />
            </Col>
            <Col span={24}><UIButtonBlock>SUBMIT</UIButtonBlock></Col>
          </Row>
        </Form>
         
        </div>
      </div>
    </section>
  );
};

export default CreatePassword;
