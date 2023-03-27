import React, { useState } from "react";
import { Form, Input } from "antd";
import './style.css';

const TextArea = (props: any) => {
    const {} =props
    const {placeholder,name,value,onChange,customInput, refer,
        type,label, initialValue, rules,customLabelClass, rows} = props
  return (
      <Form.Item
        label={label}
        // initialValue={initialValue}
        name={name}
        rules={rules}
        className={customLabelClass?`ib-0 ${customLabelClass}`: "ib-0"}
        normalize={(value) => {
          if(value.trim() === ""){
            return "";
          }else{
            return value.replace(/  +/g, ' ');
          }
          }}
      >
        <Input.TextArea
        ref={refer}
          placeholder={placeholder}
          name={name}
          value={value}         
          onChange={onChange}
          className={customInput? `ib-1 ${customInput}`: "ib-1"}
          rows={rows ?? 3}
          
        />
      </Form.Item>
  );
};

export default TextArea;

