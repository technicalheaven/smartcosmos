import { Spin } from "antd";
import "./style.css";
const UILoader = ({text}:any) => {
  return (
    <div className="UIloader">
      <Spin tip={text} />
    </div>
  );
};

export { UILoader };
