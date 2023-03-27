import './style.css';
const UICountCard = ({count, title, color, id}:any) => {
  return (

    <div className="countCard">
        <div className="colorbar" style={{backgroundColor: color ?? "red"}}></div>
        <div className="info">
            <div className="count" id={id}>{count ?? 0}</div>
            <div className="title">{title ?? "Enter Title Text"}</div>
        </div>
    </div>
  )
}

export default UICountCard