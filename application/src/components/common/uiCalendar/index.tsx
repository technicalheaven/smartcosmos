import { CloseCircleFilled } from "@ant-design/icons";
import { Col, DatePicker, Row } from "antd";
import moment from "moment";
import { useState } from "react";
import { clearIcon, leftArrowIcon, rightArrowIcon } from "../../../assets/icons";
import { UIbutton, UIsecondaryButton } from "../button";
import "./style.css";

export const UICalendar = (props: any) => {
  const { className, dropdownClassName, params, setParams, handleChange } =
    props;
  const { RangePicker } = DatePicker;

  const [range, setRange] = useState<any>();
  const [open, setOpen] = useState(false);
  const [isVisible, setVisible] = useState(false);
  const onPrevClick = () => {
    console.log("range", range);
    switch (range) {
      case "Today":
        return setParams([params[0].subtract(1, "day"), params[1]]);

      case "Yesterday":
        return setParams([params[0].subtract(1, "day"), params[1]]);

      case "This Week":
        return setParams([
          params[0].subtract(1, "week"),
          params[1].subtract(1, "week"),
        ]);

      case "Last Week":
        return setParams([
          params[0].subtract(1, "week"),
          params[1].subtract(1, "week"),
        ]);

      case "This Month":
        return setParams([
          params[0].subtract(1, "month"),
          params[1].subtract(1, "month"),
        ]);

      case "Last Month":
        return setParams([
          params[0].subtract(1, "month"),
          params[1].subtract(1, "month"),
        ]);

      case "Last 6 Month":
        return setParams([
          params[0].subtract(6, "month"),
          params[1].subtract(6, "month"),
        ]);

      default:
        return setParams([params[0].subtract(1, "day"), params[1]]);
    }
  };
  const onNextClick = () => {
    console.log("range", range);
    switch (range) {
      case "Today":
        return setParams([params[0], params[1].add(1, "day")]);

      case "Yesterday":
        return setParams([params[0], params[1].add(1, "day")]);

      case "This Week":
        return setParams([params[0].add(1, "week"), params[1].add(1, "week")]);

      case "Last Week":
        return setParams([params[0].add(1, "week"), params[1].add(1, "week")]);

      case "This Month":
        return setParams([
          params[0].add(1, "month"),
          params[1].add(1, "month"),
        ]);

      case "Last Month":
        return setParams([
          params[0].add(1, "month"),
          params[1].add(1, "month"),
        ]);

      case "Last 6 Month":
        return setParams([
          params[0].add(6, "month"),
          params[1].add(6, "month"),
        ]);

      default:
        return setParams([params[0], params[1].add(1, "day")]);
    }
  };

  document.addEventListener("mousedown", (e) => {
    let weeklyOpt = document.elementFromPoint(e.clientX, e.clientY);
    let x = weeklyOpt?.textContent;
    if (
      x == "Last Week" ||
      x == "This Week" ||
      x == "Today" ||
      x == "Yesterday" ||
      x == "This Month" ||
      x == "Last Month" ||
      x == "Last 6 Month"
    ) {
      setRange(x);
    }
  });

  const handleRange: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "day"),moment().subtract(1, "day")],
    "This Week": [moment().startOf("week"), moment().endOf("week")],
    "Last Week": [
      moment().subtract(1, "week").startOf("week"),
      moment().subtract(1, "week").endOf("week"),
    ],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
    "Last 6 Month": [
      moment().subtract(6, "month").startOf("month"),
      moment().subtract(1,"month").endOf("month"),
    ],
  };
  const Format = "MMM DD, YYYY";
  const handleCancel = () => {
    return setVisible(false);
  };

  const extraFooter = () => {
    return (
      <>
        <UIsecondaryButton
          className="calendarCancel"
          type="sm"
          onPress={handleCancel}
        >
          <span className="calendarTxtCncl">Cancel</span>
        </UIsecondaryButton>
      </>
    );
  };
  return (
    <>
      <Row>
        <div className="duration-filter" onClick={onPrevClick}>
          <img src={leftArrowIcon} className="navigationIcon" />
        </div>
        

<RangePicker 
 showTime
 className={className ? `calendarRange ${className}` : "calendarRange"}
 key={params?.toString()}
 format="MMM DD, YYYY"
 dropdownClassName={
  dropdownClassName
    ? `rangeDropDown ${dropdownClassName}`
    : "rangeDropDown"
}
renderExtraFooter={extraFooter}
ranges={handleRange}
defaultValue={params}
allowClear={false}
value={params}
open={isVisible}
onChange={(e: any, x) => handleChange(e, x)}
separator={<span style={{ fontSize: "21px" }}>-</span>}
onOk={() => {
  setRange(null);
}}
onCalendarChange={(obj: any) => {
  if (!!obj[0] && !!obj[1]) {
    setVisible(false);
  }
}}
onClick={() => setVisible(true)}
/>
      
       {params?.length ? (
        <div className="closeIconBtn" onClick={
        ()=>{
          handleChange([]);
          setParams([]);
          setVisible(false);
        }
       }><CloseCircleFilled style={{color: "rgba(0,0,0,.25)"}}/></div>
       ): ""}

        <div className="duration-filter" onClick={onNextClick}>
          <img src={rightArrowIcon} className="navigationIcon" />
        </div>
      </Row>
    </>
  );
};
