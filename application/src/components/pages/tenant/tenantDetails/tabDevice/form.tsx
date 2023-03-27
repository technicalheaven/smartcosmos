import { Col, Form, Radio, Row } from "antd";
import { useEffect, useState } from "react";
import { Regex } from "../../../../../config/constants";
import { UIcheckbox } from "../../../../common/checkbox";
import { UIInput } from "../../../../common/input";
import { UISelectInput } from "../../../../common/selectInput";
import TextArea from "../../../../common/textArea";
import "./style.css";

export const DeviceForm = (props: any) => {
  const {
    onModalSubmit,
    form,
    formValues,
    setFormValues,
    deviceModel,
    id,
    siteOptions,
    zoneOptions,
    checked,
    setChecked,
    deviceTypeOptions,
    setZones,
  } = props;

  const handleChange = (Event: any) => {
    setFormValues({
      ...formValues,
      [Event.target.name]: Event.target.value,
    });
  };

  const onChange = (Event: any) => {
    setFormValues({
      ...formValues,
      ["ipType"]: Event.target.value,
    });
    form.setFieldsValue({ ip: "" })
  };

  // useEffect(()=>{
  //   if(formValues.type === 'handHeld'){
  //     setChecked(true)
  //   }else{
  //     setChecked(false)
  //   }
  // },[formValues.type])

  const onDeviceTypeSelect = (value: any) => {
    setFormValues({
      ...formValues,
      type: value,
      siteId: null,
      model: null,
      zoneId: null,
      ip: "",
      ipType: "",
      mac: "",
      description: "",
      check: "",
    });
    form.setFieldsValue({
      siteId: null,
      model: null,
      zoneId: null,
      ip: "",
      ipType: "",
      mac: "",
      description: "",
      check: "",
    });
    setChecked(false);
  };
  const onDeviceModelSelect = (value: any) => {
    setFormValues({ ...formValues, model: value });
  };

  const handleSiteChange = (value: any) => {
    console.log("site..", value);
    if (value !== undefined) {
      setFormValues({ ...formValues, siteId: value, zoneId: null });
      form.setFieldsValue({
        zoneId: null,
      });
      setZones([]);
    } else {
      setFormValues({ ...formValues, siteId: null, zoneId: null });
      form.setFieldsValue({
        zoneId: null,
        siteId: null,
      });
      setZones([]);
    }
  };

  const handleZoneChange = (value: any) => {
    setFormValues({ ...formValues, zoneId: value });
  };

  const toggleChecked = () => {
    setChecked(!checked);
  };


  const getReqStatus = () => {
    if (formValues.type === "Fixed Reader") {
      return {
        required: true,
        message: "Fixed IP/DHCP is required",
      };
    } else {
      return {
        required: false,
        message: "Please select IP Address",
      };
    }
  };

  const getValidationRule = () => {
    if (formValues.ipType) {
      switch (formValues.ipType) {
        case "Fixed IP":
          return {
            required: true,
            pattern: new RegExp(/^\S{10,20}$/),
            message: "IP Address must contain 10 to 20 characters",
          };
        case "DHCP":
          return {
            required: true,
            pattern: new RegExp(Regex?.VALID_URL),
            message: "Please enter valid URL",
          };
      }
    } else if (formValues.type === "Fixed Reader") {
      return {
        required: true,
        message: "Please enter IP Address",
      };
    }
  };

  console.log(formValues.ip, "ipform");


  return (
    <Form
      id={id}
      form={form}
      className="modalForm"
      layout="vertical"
      onFinish={onModalSubmit}
    >
      <Row gutter={10}>
        <Col span={8}>
          <UIInput
            label="Device Name"
            placeholder="Enter Device Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter Device Name",
              },
              {
                pattern: new RegExp(Regex.VALID_NAME),
                message: "Device name should have 3 to 50 character",
              },
            ]}
            value={formValues.name}
            onChange={handleChange}
          ></UIInput>
        </Col>
        <Col span={8}>
          <UISelectInput
            label="Device Type"
            placeholder="Select Device Type"
            name="type"
            rules={[
              {
                required: true,
                message: "Please select Device Type",
              },
            ]}
            // value={formValues.type}
            onChange={onDeviceTypeSelect}
            optionValue={deviceTypeOptions}
          />
        </Col>
        <Col span={8} className="deviceCol">
          <div className="useEmailCheckBox styleDeviceCheckbox">
            <UIcheckbox onChange={toggleChecked} checked={checked} name="check">
              includes UHF sled{" "}
            </UIcheckbox>
          </div>
          <UISelectInput
            className="deviceModel"
            label="Device Model"
            placeholder="Select Device Model"
            name="model"
            rules={[
              {
                required: true,
                message: "Please select Device Model",
              },
            ]}
            // value={formValues.model}
            onChange={onDeviceModelSelect}
            optionValue={deviceModel}
          />
        </Col>
        <Col span={8} className="inputCss">
          <div className="rdAddpatient">
            <Form.Item
              label="DHCP/Fixed IP"
              name="ipType"
              rules={[getReqStatus()]}
            >
              {/* <div className=""> */}
              <Radio.Group
                name="ipType"
                onChange={onChange}
                value={formValues.ipType}
              >
                <Radio value="Fixed IP">
                  <span className="radio-text">Fixed IP</span>
                </Radio>
                <Radio value="DHCP">
                  <span className="radio-text">DHCP</span>
                </Radio>
              </Radio.Group>
              {/* </div> */}
            </Form.Item>
          </div>
        </Col>
        <Col span={8} className="inputCss">
          <UIInput
            label="Device IP Address/URL"
            placeholder="Enter Device IP Address"
            name="ip"
            rules={[getValidationRule()]}
            value={formValues.ip}
            onChange={handleChange}
          />
        </Col>
        <Col span={8} className="inputCss">
          <UIInput
            label="Device MAC Address"
            placeholder="Enter Device MAC Address*"
            name="mac"
            rules={[
              {
                required: true,
                message: "Please select Device MAC Address",
              },
              {
                pattern: new RegExp(/^\S{10,20}$/),
                message: "MAC Address must contain 10 to 20 characters",
              },
            ]}
            value={formValues.mac}
            onChange={handleChange}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UISelectInput
            label="Site (mandatory for fixed reader)"
            placeholder="Select Site"
            name="siteId"
            rules={
              formValues?.type === "Fixed Reader"
                ? [
                  {
                    required: true,
                    message: "Please select Site",
                  },
                ]
                : [
                  {
                    required: false,
                    message: "Please select Site",
                  },
                ]
            }
            // value={formValues.siteId}
            onChange={handleSiteChange}
            optionValue={siteOptions}
          />
        </Col>
        <Col span={12} className="inputCss">
          <UISelectInput
            label="Zone"
            placeholder="Select Zone"
            name="zoneId"
            rules={
              formValues?.type === "Fixed Reader"
                ? [
                  {
                    required: true,
                    message: "Please select Site",
                  },
                ]
                : [
                  {
                    required: false,
                    message: "Please select Site",
                  },
                ]
            }
            // value={formValues.zoneId}
            onChange={handleZoneChange}
            optionValue={zoneOptions}
          />
        </Col>
        <Col span={24} className="inputCss">
          <TextArea
            label="Description"
            placeholder="Description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            rules={[
              {
                pattern: new RegExp(Regex.VALID_DESCRIPTION),
                message: "Description should have maximum 250 characters.",
              },
            ]}
          ></TextArea>
        </Col>
      </Row>
    </Form>
  );
};
