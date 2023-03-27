import { Dropdown, Menu } from 'antd';
import './style.css';

const UIDropdown = (props:any) => {
    const menu = (
        <Menu
          items={props.items}
        />
      );
return (
  <Dropdown className='dropdown-menu' placement={props.placement} overlay={menu} trigger={props.trigger || ["click"]}>
 
     {props.children}

  </Dropdown>
)
};

export { UIDropdown }; 