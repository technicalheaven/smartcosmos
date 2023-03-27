import { JsonToTable } from "react-json-to-table"

const UITableChart = ({ data }:any) => {
  return (
<>{!data ? ("No Data Found"): (<JsonToTable json={data} />)}</> 
)
}

export default UITableChart