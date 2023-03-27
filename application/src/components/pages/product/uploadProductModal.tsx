import { message, Space, Upload, UploadFile } from "antd";
import { RcFile, UploadProps } from "antd/lib/upload";
import { useEffect, useState } from "react";
import { apiRoutes, baseURL } from "../../../config/api";
import { UIbutton, UIsecondaryButton } from "../../common/button";
import { UIModal } from "../../common/modal";
import * as util from "util";
import "./style.css";
import { ModalButton, ModalType, PageTitle } from "../../../config/enum";
import { UIConfirmModal } from "../../common/confirmModal";
import { type } from "os";
import { Link } from "react-router-dom";
import { UILoader } from "../../common/loader";


const UploadProductModal = ({
  visible,
  handleCancel,
  title,
  actionType,
  tenantId,
  tenantName,
  userId,
  userName,
  setProductUploadModal,
  refetch,
  page,
  fileList,
  setFileList,
}: any) => {
  const { Dragger } = Upload;
  const [uploading, setUploading] = useState(false);
  const [confirmProductUpload, setConfirmProductUpload] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [tagUploadResponseModal, setTagUploadResponseModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [tagUploadCounts, setTagUploadCounts] = useState({success: null, failed: null, errorReportLink: null});
  const [messageType, setMessaeType] = useState(ModalType.SUCCESS)

  const handleAlertMessage = (status:boolean, message:string, type:ModalType) => {
    setConfirmProductUpload(status);
    setMessageText(message);
    setMessaeType(type);
  }

  const handleUpload = () => {
    if(!fileList.length){
      setLoader(false);
      message.error('Please choose file wants to upload.');
      return;
    }
    const formData = new FormData();
    let route = "";
    fileList.forEach((file: any) => {
      formData.append("file", file as RcFile);
      if (page === PageTitle.PRODUCTS) {
        route = util.format(apiRoutes.PRODUCTS_UPLOAD, tenantId);
        formData.append("actionType", actionType);
        formData.append("userId", userId);
      } else if (page === PageTitle.FACTORY_TAGS) {
        route = apiRoutes.FACTORY_TAG_UPLOAD;
        formData.append("userId", userId);
        formData.append("userName", userName);
        formData.append("tenantId", tenantId);
        formData.append("tenantName", tenantName);
      }
    });
    setUploading(true);
    setLoader(true);
    // You can use any AJAX library you like

    fetch(baseURL + route, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFileList([]);
        if (data.error) {
          handleAlertMessage(true, data?.error?.message, ModalType.WARN )
          // message.error(data?.error?.message);
        } else {
          console.log('response..' );
          if (page === PageTitle.FACTORY_TAGS) 
          {
            const failedData=data?.result?.duplicateData.concat(data?.result?.validationData)
            setTagUploadCounts({success: data?.result?.addedData.length, failed: failedData.length, errorReportLink: data?.result?.errorReportLink})
            setTagUploadResponseModal(true);
          }else{
            handleAlertMessage(true, data?.result?.message, ModalType.SUCCESS)
            console.log(data?.result?.message,"....");
            
          }
          setProductUploadModal(false);
        }
        refetch();
      })
      .catch(() => {
        if(page === PageTitle.FACTORY_TAGS){
          message.error("Factory Tags upload failed.");
        }else{
          handleAlertMessage(true, "Product upload failed.",ModalType.WARN)
        }
      })
      .finally(() => {
        setUploading(false);
        setLoader(false);
      });
  };

  const UploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };


  const onActivateModalClose = () => {
    handleAlertMessage(false, "", ModalType.SUCCESS)
  };

  return (
    <>
    {loader && <UILoader />}
      <UIModal
        title={title}
        visible={visible}
        width={600}
        className="productUploadModal"
        footer={[
          <Space size={20}>
            <UIsecondaryButton onPress={handleCancel} size="sm">
              CANCEL
            </UIsecondaryButton>
            <UIbutton
              onPress={handleUpload}
              type="info"
              btnType="submit"
              size="sm"
            >
              UPLOAD
            </UIbutton>
          </Space>,
        ]}
      >
        <Dragger {...UploadProps}>
          <div className="uploadArea">
            Drag & drop or <span className="browse">browse</span> {page === PageTitle.FACTORY_TAGS ? "tags" : "products"} .xlsx 
            file
          </div>
        </Dragger>
      </UIModal>

      <UIConfirmModal
      className="productUploadSuccess"
        key="activateTenant"
        visible={confirmProductUpload}
        confirmCallback={onActivateModalClose}
        confirmButton={ModalButton.OK}
        showCancelButton= {false}
        primaryText={messageText}
        type={messageType}
      />
      


        {/* factory tag upload response modal */}

        <UIModal
        // title={"Data Upload Completed"}
        visible={tagUploadResponseModal}
        handleCancel={()=>{setTagUploadResponseModal(false)}}
        width={500}
        className={"tagUploadResponseModal"}
        footer={false}
        closable={false}
      >
        <section className="content">
        <h4 className="title">Data Upload Completed</h4>
        <ul className="text">
          <li><strong>{tagUploadCounts?.success} Tags</strong> Uploaded successfully.</li>
          <li><strong>{tagUploadCounts?.failed} Tags</strong> Failed to upload, see <a href={tagUploadCounts?.errorReportLink ?? ""}>link</a> for details.</li>
        </ul>
       </section>

        <div className="exitBtn text-center">
        <UIbutton type="info" size="md" onPress={()=>{setTagUploadResponseModal(false)}}>EXIT</UIbutton>
        </div>
      </UIModal>

        {/* factory tag upload response modal */}

      </>
  );
};


export default UploadProductModal;
