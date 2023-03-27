import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { RcFile, UploadFile, UploadProps } from "antd/lib/upload";
import { UIImage } from "../image";
import "./style.css";
import { UIAvatar } from "../avatar";
import { cameraIcon } from "../../../assets/icons";

const UIProfilePicUploader = ({
  loading,
  name,
  action,
  onChange,
  className,
  avatarText,
  imageUrl,
}: any) => {
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isJpgOrPng && !isLt2M) {
      message.error("Invalid file format");
    } else if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    } else if (!isLt2M) {
      message.error("Image must smaller than 1MB!");
    }

    return isJpgOrPng && isLt2M;
  };

  const ProfilePicUploadButton = () => {
    return (
      <div className="profilePicUploadButton">
        {loading ? (
          <LoadingOutlined />
        ) : imageUrl ? (
          <UIImage src={imageUrl} />
        ) : avatarText ? (
          <UIAvatar
            height="100px"
            width="100px"
            size="28px"
            text={avatarText}
            type="username"
          />
        ) : (
          <PlusOutlined />
        )}
        <span className="icon">
          <UIImage src={cameraIcon} height="15px" width="15px" />
        </span>
      </div>
    );
  };

  return (
    <Upload
      name={name}
      className={className}
      action={action}
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={onChange}
    >
      <ProfilePicUploadButton />
    </Upload>
  );
};

export { UIProfilePicUploader };
