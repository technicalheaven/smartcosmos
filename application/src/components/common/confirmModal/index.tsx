import { Col, Modal, Row, Space } from "antd";
import { inviteIcon } from "../../../assets/icons";
import { redCross, greenTick } from "../../../assets/images";
import { ModalType } from "../../../config/enum";
import { UIbutton, UIsecondaryButton } from "../button";
import "./style.css"

export const UIConfirmModal = (props: any) => {
  const {
    type,
    primaryText,
    visible,
    confirmButton,
    cancelButton,
    confirmCallback,
    cancelCallback,
    showCancelButton = true,
    className
  } = props;  

  const getIconType = () => {
    if (type == ModalType.WARN) return redCross;
    else if (type == ModalType.INVITE) return inviteIcon;
    else return greenTick;
  };
  return (
    <Modal
      wrapClassName={className? `modalClass ${className}`: "modalClass"}
      visible={visible}
      // onCancel={cancelCallback}
      centered
      footer={null}
      closable={false}
    >
      <Row justify="center">
        <Col>
          <img className="redCoss" src={getIconType()} />
        </Col>
      </Row>
      <Row justify="center">
        <Col xl={24}>
          <div className="primaryText">
            <span style={{width:"100%"}}>{primaryText}</span>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Space size={20}>
          {showCancelButton && (<UIsecondaryButton onPress={cancelCallback}>
            {cancelButton}
          </UIsecondaryButton>)}
          <UIbutton type="info" onPress={confirmCallback}>
            {confirmButton}
          </UIbutton>
        </Space>
      </Row>
    </Modal>
  );
};
