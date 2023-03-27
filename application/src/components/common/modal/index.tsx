import { Modal } from "antd";
import "./style.css";

export const UIModal = (props: any) => {
  //destructuring props
  const { visible, handleCancel=false, handleOk, title, footer, className, width, closable=false } = props;

  return (
    <>
          <Modal
            wrapClassName={className ? `${className} modalClass` : "modalClass"}
            title={title}
            visible={visible}
            footer={footer}
            onCancel={handleCancel}
            onOk={handleOk}
            closable={closable}
            width={width}
          >
            {props.children}
          </Modal>
    </>
  );
};
