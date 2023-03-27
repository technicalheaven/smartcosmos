import { Form, Input} from "antd";
import './style.css';

const UIInput = (props: any) => {
    const {id, placeholder,name,value,onChange,label,defaultValue,initialValue, validateTrigger,rules,type,disabled,onBlur, onFocus, ref, className} = props 
  return (
      <Form.Item
        key={name}
        label={label}
        name={name}
        rules={rules}
        className={`inputBox-0 ${className}`}
        validateTrigger={validateTrigger}
        initialValue={initialValue}
        normalize={(value) => {
        if(value.trim() === ""){
          return "";
        }else{
          return value.replace(/  +/g, ' ');
        }
        }}
      >
        <Input
        id={id}
          key={name}
          placeholder={placeholder}
          name={name}
          type={type}
          disabled={disabled}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={ref}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          className="inputBox-1"
        />
      </Form.Item>
  );
};

const UIInputPassword = (props: any) => {
  const {placeholder,name,className,value,onChange,label,initialValue,rules,type,disabled,onBlur} = props
return (

    <Form.Item
      label={label}
      initialValue={initialValue}
      name={name}
      rules={rules}
      className="inputBox-0"
      normalize={(value) => {
        if(value.trim() === ""){
          return "";
        }else{
          return value.replace(/  +/g, ' ');
        }}
      }
    >
      <Input.Password 
        placeholder={placeholder}
        name={name}
        value={value}
        type={type}
        onChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        className={className? `${className} inputBox-1`:"inputBox-1"}
      />
    </Form.Item>
);
};
export {UIInput, UIInputPassword};

