import { CaretDownOutlined } from "@ant-design/icons"
import { Select } from "antd"
import { projectIcon } from "../../../assets/icons"
import { UIImage } from "../image"
import './style.css'

const UIFilterSelectInput = ({options, placeholder, allowClear, defaultValue, value ,prefixIcon,onChange,className}:any) => {
  return (
    <div className="ui-filter-select-input">
              <div className="icon"><UIImage src={prefixIcon} width="15px"/></div>
              <Select
              showSearch
              className={className}
                defaultValue={defaultValue}
                value={value}
                allowClear={allowClear}
                placeholder={placeholder}
                options={options}
                onChange={onChange}
                filterOption={(input, option) =>{
                  const str:any = option?.label ?? '';
                  return str.toLowerCase().includes(input.toLowerCase())
                }
                }
              />
            </div>
  )
}

export default UIFilterSelectInput