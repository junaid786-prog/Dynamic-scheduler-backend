import { motion } from "framer-motion"
import Image from "next/image"
import HtmlMapper from "react-html-map"
import styles from "../styles/blog.module.css"
import YoutubeView from "react-youtube"

const EventCard = ({ event }) => {
  const opts = {
    height: "200",
    width: "300",
    playerVars: {
      autoplay: 1,
    },
  };
  return (
    <motion.section className={styles.blog_card}>
      <motion.h2 className={styles.blog_card_heading}>{event?.title}</motion.h2>
      <Image src={event?.poster[0]} width={500} height={300} className={styles.blog_card_img} alt={event?.title} />
      <div>
        <div dangerouslySetInnerHTML={{ __html: event?.description }} >
        </div>
        
      </div>
    </motion.section>
  )
}

export default EventCard