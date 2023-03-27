import { barChartIcon } from "../../../assets/icons"
import { UIImage } from "../image"
import './style.css'

const ChartPlaceHolder = () => {
  return (
    <section className="chartPlaceHolder">
        <div className="content">
            <div className="icon"><UIImage src={barChartIcon} width={50} /></div>
            <div className="text">No data to available</div>
        </div>
    </section>
  )
}

export default ChartPlaceHolder