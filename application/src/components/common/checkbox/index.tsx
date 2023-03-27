import { Checkbox } from 'antd';
import './style.css';

const UIcheckbox = ({onChange,key, children, defaultChecked, checked, size, value, name}:any) => {
  return (
    <Checkbox className={`${size == "lg" && "lg"}`} checked={checked}  key={key} defaultChecked={defaultChecked} onChange={onChange} value={value} name={name}>{children}</Checkbox>
  )
}

export {UIcheckbox}