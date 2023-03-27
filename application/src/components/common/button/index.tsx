import './style.css';
import { addIcon, editIcon, plusIcon, downloadIcon, exportIcon, updateIcon } from '../../../assets/icons';

const UIbutton = (props:any) => {
  const {onPress, type, size, children, btnType, form, className} = props;
  return (
    <button onClick={onPress} form={form} type={btnType} className={className? `${className} uiBtn f-14 ${type} ${size || "md"}`:` uiBtn f-14 ${type} ${size || "md"}`}>{children}</button>
  )
}

const UIButtonBlock = (props:any) => {
  const {onPress, children, disableBtn} = props;
  return (
    <button onClick={onPress} disabled={disableBtn} className="uiBtn blockBtn">{children}</button>
  )
}


const UIsecondaryButton = (props:any) => {
  const {onPress, size, children, disableBtn, className, btnType} = props;
  return (
    <button onClick={onPress} disabled={disableBtn} type={btnType} className={ className ? `${className} uiBtn f-14 secondaryBtn ${size || "md"}` : `uiBtn f-14 secondaryBtn ${size || "md"}`}>{children}</button>
  )
}

const UIIconbutton = (props:any) => {
  const {onPress, type, size, icon, children, btnType, disableBtn} = props;
  return (
    <button onClick={onPress} type={btnType} disabled={disableBtn} className={`uiBtn  iconBtn ${type} ${size || "md"}`}>{icon && <img src={getButtonIcon(icon)} /> }{children}</button>
  )
}

function getButtonIcon(iconType:any){
    switch(iconType){
        case "add" : return addIcon;
        case "edit" : return editIcon;
        case "plus" : return plusIcon;
        case "download" : return downloadIcon;
        case "export" : return exportIcon;
        case "update" : return updateIcon;
    }
}

export { UIbutton, UIIconbutton, UIsecondaryButton, UIButtonBlock }
