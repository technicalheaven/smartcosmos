import './style.css';
const UIImage = (props:any) => {
  const {src, text, height, width} = props;
  return (
    <img src={src} alt={text} style={{height: height, width: width || "100%"}}/>
  )
}

const UIProfilePicPreview = (props:any) => {
  const {src, text, height, width, className} = props;
  return (
    <div className={className ? `${className} profilePicPreview` : "profilePicPreview"}>
      <img src={src} alt={text} style={{height: height || "48px", width: width || "48px", objectFit: 'cover'}}/>
    </div>
  )
}

export { UIImage, UIProfilePicPreview }