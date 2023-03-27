import { Space } from "antd";
import { barsIcon, fileDownloadIcon, tableDarKIcon } from "../../../assets/icons";
import { downloadHtml2Pdf } from "../../../utils";
import { UIImage } from "../image";
import "./style.css";

const ChartLayout = ({title,children, toggleView, setToggleView, info}:any) => {
  return (
    <div className="chartLayout">
      <section className="topBar">
        <h3 className="title">{title}</h3>
        <div className="actions">
          <Space size={15}>
            <div className="actionBtn" onClick={() => {setToggleView(!toggleView)}}>{toggleView ? <UIImage src={tableDarKIcon} /> : <UIImage src={barsIcon} width={15} />}</div>
            <div className="actionBtn" onClick={(e:any) => {
              const input:any = e.target.parentElement.offsetParent.querySelector(".chartLayout");  
              
              let fileName = 'Report.pdf';
             
              if(info?.entity === 'tenant' && !!info?.name){
                fileName = `Tenant_${info?.name}_${fileName}`;
              }

              if(info?.entity === 'site' && !!info?.name){
                fileName = `Site_${info?.name}_${fileName}`;
              }
              
              downloadHtml2Pdf(input, fileName);
            }}><UIImage src={fileDownloadIcon} /></div>
          </Space>
        </div>
      </section>
      {children}
    </div>
  )
}

export default ChartLayout