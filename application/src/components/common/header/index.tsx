import { Layout, message, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  changePasswordIcon,
  dropDownIcon,
  hammerBergIcon,
  logoutLightIcon,
  userIcon,
} from "../../../assets/icons";
import { scRoundLogo, scWhiteTextLogo } from "../../../assets/images";
import { ModalTitle } from "../../../config/enum";
import { setIsUserUpdated } from "../../../redux/features/app/appSlice";
import {
  getIsLoggedIn,
  getUserInfo,
  logOut,
  setUserInfo,
} from "../../../redux/features/auth/authSlice";
import { getFilterInfo, resetFilterState } from "../../../redux/features/filter/filterSlice";
import {
  useGetAllSitesQuery,
  useGetSiteByIdQuery,
} from "../../../redux/services/siteApiSlice";
import { useUpdateUserMutation } from "../../../redux/services/userApiSlice";
import { Page } from "../../../routes/config";
import ResetPasswordModal from "../../pages/user/resetPasswordModal";
import { UIAvatar } from "../avatar";
import UIBreadcrumb from "../breadcrumb";
import { UIbutton, UIsecondaryButton } from "../button";
import { UIDropdown } from "../dropdown";
import { UIImage } from "../image";
import { UIModal } from "../modal";
import { UIErrorAlert } from "../uiAlert";
import { ProfileForm } from "./profileForm";
import "./style.css";
const { Header } = Layout;

const SmartCosmosLogo = ({ collapsed }: any) => (
  <Link to={Page.DASHBOARD}>
    <div className="sclogo">
      <div className="sphere">
        <UIImage src={scRoundLogo} text="small-logo" width={45} />
      </div>
      {!collapsed && (
        <div className="logotext">
          <UIImage src={scWhiteTextLogo} text="text-logo" />
        </div>
      )}
    </div>
  </Link>
);

const UIHeader = (props: any) => {
  const [isResetPasswordModalVisible, setIsResetPasswordModalVisible] =
    useState(false);
  const [form] = useForm();
  const userInfo = useSelector(getUserInfo);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState(userInfo);
  const { collapsed, setCollapsed } = props;
  const navigate = useNavigate();
  const isLoggedInUser: any = useSelector(getIsLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentURL = window.location.href;
  const stateSearch = useSelector(getFilterInfo);

  const onModalClose = () => {
    setIsModalVisible(!isModalVisible);
    form.resetFields();
  };

  // reset filters on page change
  useEffect(() => { 
    if(stateSearch?.url != currentURL){
      dispatch(resetFilterState());
    }
  }, [location]);

  const [errorAlert, setErrorAlert] = useState(false);
  const [updateUser, updateUserInfo] = useUpdateUserMutation();
  const { data } = useGetSiteByIdQuery(userInfo?.userRole?.homeSite, {
    refetchOnMountOrArgChange: true,
  });
  console.log(data, "home>>.");

  const getAllSites = useGetAllSitesQuery({
    tenantId: userInfo?.userRole?.tenantId
      ? userInfo?.userRole?.tenantId
      : userInfo?.tenantId,
  });

  const EditProfileSubmit = () => {
    const {
      name,
      email,
      imageUrl,
      siteId,
      userRole: { homeSite, roleId },
    } = formValues;
    console.log("inside submit", formValues);
    updateUser({ name, email, imageUrl, homeSite, roleId, id: userInfo?.id });
  };
  useEffect(() => {
    if (updateUserInfo?.isError) {
      setErrorAlert(true);
    }
  }, [updateUserInfo?.isError]);

  const showUpdateAlert = () => {
    if (updateUserInfo?.isError) {
      return (
        <UIErrorAlert
          type="error"
          message={
            updateUserInfo?.error?.data?.error?.message?.errors
              ? "Something  went wrong"
              : updateUserInfo?.error?.data?.error?.message
          }
          showAlert={errorAlert}
          setShowAlert={setErrorAlert}
        />
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (updateUserInfo?.isSuccess) {
      dispatch(setUserInfo(updateUserInfo?.data?.result));
      form.resetFields();
      message.success({
        content: `Profile updated successfully`,
        key: "errorNotification",
      });
      setIsModalVisible(!isModalVisible);
      updateUserInfo?.reset();
    }
  }, [updateUserInfo?.isSuccess, updateUserInfo?.fulfilledTimeStamp]);

  useEffect(() => {
    if (updateUserInfo?.isSuccess) {
      dispatch(setIsUserUpdated(true));
    }
  }, [updateUserInfo?.isSuccess]);

  const UserProfileClick = () => {
    setIsModalVisible(true);
    const {
      email,
      name,
      username,
      userRole: { homeSite },
    } = userInfo;
    setFormValues(userInfo);
    form.setFieldsValue({ email, name, username, homeSite });
  };

  const getSitesOption = () => {
    const siteArray = userInfo?.userRole?.siteId ?? userInfo?.siteId;
    const sites: any = getAllSites?.data?.result?.rows;

    const siteOptions =
      siteArray !== undefined && sites !== undefined
        ? siteArray.map((x: any) => {
            const item: any = sites.find((y: any) => y.id === x);
            return { text: item?.name, value: item?.id };
          })
        : [];

    return siteOptions;
  };

  const userLogout = () => {
    localStorage.clear();
    window.location.href = Page.HOME;
    // navigate(Page.LOGIN);
  };

  const userDropDownOptions = [
    {
      label: "My Profile",
      key: "1",
      onClick: () => UserProfileClick(),
      icon: (
        <div className="userDropdownIcon userIcon">
          <img src={userIcon} alt="icon" />
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      label: "Change Password",
      key: "2",
      onClick: () => setIsResetPasswordModalVisible(true),
      icon: (
        <div className="userDropdownIcon">
          <img src={changePasswordIcon} alt="icon" />
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      label: "Logout",
      key: "3",
      onClick: () => {
        userLogout();
      },
      icon: (
        <div className="userDropdownIcon">
          <img src={logoutLightIcon} alt="icon" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Header className="site-layout-background fixedHeader header">
        <div
          className={`logo ${collapsed ? "collapsedWidth" : "sidebarWidth"}`}
          style={{ textAlign: "center", transition: "0s" }}
        >
          <SmartCosmosLogo collapsed={collapsed} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "calc(100% - 250px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className="hammerberg"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              <UIImage src={hammerBergIcon} text="icon" />
            </div>
            <div className="breadcrumbMargin" style={{ marginLeft: 75 }}>
              <UIBreadcrumb />
            </div>
          </div>
          <UIDropdown items={userDropDownOptions} placement="bottom">
            <div className="profileImageSection">
              <div className="profileImage">
                {userInfo.imageUrl ? (
                  <UIImage src={userInfo.imageUrl} height={50} width={50} />
                ) : (
                  <UIAvatar text={userInfo?.name} type="username" />
                )}
              </div>
              <div className="info">
                <div className="name">{userInfo?.name}</div>
                <div className="role">
                  {userInfo?.userRole?.roleName
                    ? userInfo?.userRole?.roleName
                    : userInfo?.roleName}
                </div>
              </div>
              <div className="icon">
                <img src={dropDownIcon} alt="dropdown icon" />
              </div>
            </div>
          </UIDropdown>
        </div>
        <ResetPasswordModal
          title={ModalTitle.CHANGE_PASSWRD}
          isModalVisible={isResetPasswordModalVisible}
          data={userInfo}
          setIsModalVisible={setIsResetPasswordModalVisible}
          type="changePassword"
        />
      </Header>

      <UIModal
        title={ModalTitle.EDIT_PROFILE}
        data-testid="editmodal"
        visible={isModalVisible}
        // handleCancel={onModalClose}
        footer={[
          <Space>
            <UIsecondaryButton onPress={onModalClose} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              form="editprofile"
              type="info"
              btnType="submit"
              size="sm"
              data-testid="testButton"
            >
              SAVE
            </UIbutton>
          </Space>,
        ]}
      >
        <div>{showUpdateAlert()}</div>
        <ProfileForm
          id="editprofile"
          formValues={formValues}
          form={form}
          setFormValues={setFormValues}
          onModalSubmit={EditProfileSubmit}
          homeSiteData={data}
          userData={userInfo}
          siteOption={getSitesOption()}
        />
      </UIModal>

      {/* session expire alert */}
      {!isLoggedInUser && (
        <div className="session_expired_alert">
          <div className="content">
            <div className="message">Session Expired! Need to Login</div>
            <div className="btn">
              <UIbutton type="info" size="md" onPress={userLogout}>
                Login
              </UIbutton>
            </div>
          </div>
        </div>
      )}

      {/* session expire alert */}
    </>
  );
};

export default UIHeader;
