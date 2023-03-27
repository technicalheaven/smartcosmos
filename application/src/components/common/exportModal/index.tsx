import { List, Space, Tag } from "antd";
import { UIModal } from "../../common/modal";
import './style.css';
import { UIbutton, UIsecondaryButton } from "../button";
import { DownloadOutlined } from "@ant-design/icons";
import { downloadWithAxios } from "../../../utils";
import { apiRoutes, baseURL } from "../../../config/api";
import { useState } from "react";
import { UILoader } from "../loader";
import * as util from "util";

const UIExportModal = ({total = 0, chunkSize = 0, isModalVisible, setIsModalVisible, title, filters, filename, apiEndPoint}:any) => {

    const [loading, setLoading] = useState(false);
    const chunks = Math.ceil(total/chunkSize);
    const qs = new URLSearchParams(filters).toString();
    const url = `${baseURL + apiEndPoint}?${qs}`; 
    

    let data = [];

    for (let i = 0; i < chunks; i++) {
        let offset = chunkSize*i;
        let left = total % chunkSize;
        let range = [offset == 0 ? 1 : offset , (chunks == i+1) && left ? offset + left : chunkSize*(i+1)];
        data.push({chunk: i+1,text: `Chunk ${i+1}`, offset, range });
    }

  return (
    <UIModal
        title={title}
        data-testid="editmodal"
        closable={true}
        handleCancel={() => { setIsModalVisible(false) }}
        visible={isModalVisible}
        footer={null}
    >
{loading && <UILoader/>}
<List
      header={<strong className="totalRecords">Total Records : {total}</strong>}
    //   footer={<div>Footer</div>}
      bordered
      dataSource={data}
      className="chunks"
      renderItem={(item) => (
        <List.Item>
         <div>{item.text}</div>
         <div><Tag color="magenta">{item.range[0]}-{item.range[1]}</Tag></div>
         <div><a href="javascript:void(0)" onClick={()=>{
          filename = util.format(filename, `chunk${item.chunk}`);
          setLoading(true);
          downloadWithAxios(url+`&offset=${item.offset}`, filename, setLoading);
         }}><DownloadOutlined /> Download</a></div>
        </List.Item>
      )}
    >

</List>

    </UIModal> 
  )
}

export default UIExportModal