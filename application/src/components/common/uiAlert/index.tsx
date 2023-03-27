import './style.css';
import {closeIcon, successIcon, errorIcon, warningIcon} from '../../../assets/icons';

import { UIImage } from '../image';
import { useEffect, useState } from 'react';

const UIAlert = (props:any) => {
  const {message, type, showAlert, setShowAlert} = props;

  return (
    <>
    {showAlert && (<div className={`uiAlert ${type}`}>
    {type && (<div className="icon"><UIImage src={getButtonIcon(type)} text="icon"/></div>)}
    <div className="content">{message}</div>
    <div className="close" onClick={()=>{setShowAlert(false);}}><UIImage src={closeIcon} text="close icon"/></div>
    </div>)}
    </>
  )
}

const UIErrorAlert = (props:any) => {
  let {children, type = "error", message, showAlert, setShowAlert} = props;
  function createMarkup() { return {__html: children }; };

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false)
    }, 
    3000
    )
  }, []);

  return (
    <>
    {showAlert && (<div className={`uiAlert errorAlert ${type}`}>
      {message ? 
    <div className="content">{message}</div> : 
    <div className="content" dangerouslySetInnerHTML={createMarkup()}></div>
      }
    </div>)}
    </>
  )
}


function getButtonIcon(type:any){
    switch(type){
        case "success" : return successIcon;
        case "error" : return errorIcon;
        case "warning" : return warningIcon;
    }
}

export { UIAlert, UIErrorAlert }