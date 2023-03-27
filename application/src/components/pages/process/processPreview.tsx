import { Card, Col, Divider, Row } from "antd"
import Title from "antd/lib/typography/Title";
import { useEffect, useRef, useState } from "react";
import { UIImage } from "../../common/image"
import { getActionIcon } from "./common"

const ProcessPreview = ({steps ,startLoop, visible}:any) => {
const [stepIndex, setStepIndex] = useState(0);
const [scroll, setScroll] = useState(false); 
const loopActionPosition = startLoop? startLoop: 0;
const loopLastStep = steps.length-1 == loopActionPosition ? true : false;
const space = 120;
const distance =  startLoop && steps.length >= 2 ? space * loopActionPosition : 0;
const steplinewidth  = space * (steps.length - (steps.length - loopActionPosition));
console.log('steps inside processpreview',steps, startLoop, loopActionPosition);
const x = setInterval(()=>{
if(stepIndex < steps.length-1){
    setStepIndex(stepIndex+1);
}else{
  
    setStepIndex(loopActionPosition);
}
clearInterval(x);
}, 1500);

// make preview scrollable starts
const stepsRow:any = useRef();
const stepsWrapper:any = useRef();

const scrollControl = ()=>{
  let stepsWrapperWidth:any;
  let stepsRowWidth:any;

  const getWidth = () => {
        const stepsWrapperCSS = window.getComputedStyle(stepsWrapper.current, null);
        stepsWrapperWidth = parseInt(stepsWrapperCSS.getPropertyValue("width"), 10);
  
        const stepsRowCSS = window.getComputedStyle(stepsRow.current, null);
        stepsRowWidth = parseInt(stepsRowCSS.getPropertyValue("width"),10);

        console.log({stepsWrapperWidth,stepsRowWidth});
        
        if(stepsRowWidth > stepsWrapperWidth){
          setScroll(true);
        }else{
          setScroll(false);
        }
  }
        getWidth();
       
        if(isNaN(stepsWrapperWidth) || isNaN(stepsRowWidth)){
        setTimeout(()=>{
            getWidth();
          }, 100)
        }

      
}

useEffect(()=>{
scrollControl();
window.addEventListener('resize', scrollControl, true);
},[])
// make preview scrollable ends


  return (
    <section className="processPreviewSection">
    <Title level={4}>Preview</Title>
    <Divider />
    <Title level={5} style={{ textAlign: "left" }}>
      Step {stepIndex+1}
    </Title>
    
    <div className="previewCard">
      <Card>
        <Row className="mb-20 justify-content-center">
          <Col span={12}>
            <div className="stepBox large">
              <div className="title">{steps[stepIndex]["name"]}</div>
              <div className="icon">
                <UIImage src={getActionIcon(steps[stepIndex]["name"])} />
              </div>
            </div>
          </Col>
        </Row>
       
       <section className={`stepswrapper ${scroll && 'scroll'}`} ref={stepsWrapper}>
        <Row gutter={[20,20]} className="justify-content-center processStepsRow" ref={stepsRow}>
          <span className="loopborder" style={{left: 60 + distance, width: loopLastStep ? 60 : "auto"}}></span>
          <span className="looparrow" style={{left: 55 + distance}}></span>
          <span className="stepline" style={{width: steplinewidth}}></span>
          {steps.map((item: any, index: any) => (
            <Col>
              <div className={`stepBox ${index == stepIndex && "active"}`}>
                <div className="title">{item?.name}</div>
                <div className={`icon ${( loopActionPosition <= index) && "pulse"}`}>
                  <UIImage src={getActionIcon(item?.name)} />
                </div>
              </div>
            </Col>
          ))}
        </Row>
        </section>
      </Card>
    </div>
  </section>
  )
}

export default ProcessPreview