import { JsonToTable } from "react-json-to-table";

export const ViewMetaData = ({ json }: any) => { 
  return (
    <div className="productMetadata">
    {!Object.keys(json).length ? ("No Data Found"): (<JsonToTable json={json} />)}   
    </div>
  );
};
