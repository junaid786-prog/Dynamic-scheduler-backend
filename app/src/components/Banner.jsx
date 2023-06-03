import dynamic from "next/dynamic"
import bannerStyles from "../styles/home.module.css"

const Video = dynamic (()=>import('./Video'))
const Banner = () => {
  return (
    <div className={bannerStyles.home_banner}>
      <Video/>
    </div>
  )
}

export default Banner