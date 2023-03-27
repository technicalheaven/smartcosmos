import './style.css';

const UIAvatar = ({text, type, height, width, size}: any) => {

  let output = "";
  output = ((type === 'username' || type === 'name')  &&  text !== "") ? text?.substring(0,2).toUpperCase() : ""; 
  const colors = [
    {
        backgroundColor:"#FFB7B54D",
        // borderColor:"#DC143C",
        color:"#DC143C",
    },
    {
        backgroundColor:"#227F994D",
        // borderColor:"#227F99",
        color:"#227F99",
    },
    {
        backgroundColor:"#FF78414D",
        // borderColor:"#FF7841",
        color:"#FF7841",
    },
    {
        backgroundColor:"#99B0E04D",
        // borderColor:"#0E3077",
        color:"#0E3077",
    },
];

const colorObj = colors[Math.floor(Math.random()*colors.length)];
  return (
    <div className="avatar" style={{...colorObj, border: '1px solid', height: height || "48px", width: width || "48px"}}>
        <div className="content" style={{fontSize: size || "14px"}}>{output}</div>
    </div>
  )
}

export { UIAvatar }