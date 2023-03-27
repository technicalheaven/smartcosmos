import { Tooltip } from "antd";
import "./style.css";

const UITooltip = (props: any) => {
  const { content, title, color, overlayClassName, children , placement} = props;
  return (
    <>
          <Tooltip
            title={title}
            color="#0E5C72"
            placement={placement}
            // overlayClassName={
            //   overlayClassName ? `tb-0 ${overlayClassName}` : "tb-0"
            // }
          >
            {children}
          </Tooltip>
    </>
  );
};

export default UITooltip;
