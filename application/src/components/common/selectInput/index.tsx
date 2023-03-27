import { Select, Form } from "antd";
import "./style.css"

export const UISelectInput = (props: any) => {

  const { Option } = Select;
  const {
    className,
    bordered,
    defaultValue,
    onChange,
    optionValue,
    value,
    placeholder,
    optionClass,
    mode,
    label,
    initialValue,
    customLabelClass,
    name,
    rules,
    disabled,
    showSearch,
    refer
  } = props;

  // sort options alphabetically 

  let sortedOptions = Array.isArray(optionValue) ? optionValue.sort((a: any, b: any) => {
    if (a.text < b.text) return -1
    return a.text > b.text ? 1 : 0
  }) : [];

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      className={className ? `${className} ib-0` : "ib-0"}
      initialValue={initialValue}
    >
      <Select
        disabled={disabled}
        className="custom"
        bordered={bordered}
        onChange={onChange}
        mode={mode}
        defaultValue={defaultValue}
        value={value}
        dropdownClassName="dropdown"
        placeholder={placeholder}
        showSearch={showSearch}
        showArrow
        maxTagCount="responsive"
        filterOption={(input: any, option: any) =>
          option.children.toLowerCase().startsWith(input.toLowerCase())
        }
        getPopupContainer={(trigger: any) => trigger.parentNode}
        ref={refer}
        allowClear
      >
        {sortedOptions?.map((option: any, index: any) => {
          return (
            <Option
              value={option.value}
              className={optionClass ? `optionClass` : "options"}
            >
              {option.text}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );
};

