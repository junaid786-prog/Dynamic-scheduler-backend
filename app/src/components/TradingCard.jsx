import Image from "next/image"
import styles from "../styles/components.module.css"
import addIcon from "../images/add_icon.png"
import AdminActions from "./AdminActions"
import { motion } from "framer-motion"
import { useState } from "react"
import BlogCard from "./EventCard"

const TradingCard = ({ event, isAdmin, events, setevents }) => {
  console.log(event)
  const [showBlog, setShowBlog] = useState(false)
  return (
    <motion.div
      className={styles.trading_card_container}
    >
      <div className={styles.trading_card}>
        <div className={styles.card_image_part}>
          <Image src={event?.poster[0]} width={180} height={120} alt={event?.title} />
        </div>
        <div className={styles.card_content_part}>
          <h4>{event?.title?.substring(0, 80)}</h4>
          <p>{event?.description?.substring(0, 170) + "...."}</p>
          {!isAdmin && <div className={styles.add_icon_div} onClick={() => setShowBlog(!showBlog)}>
            <div className={styles.add_icon}>
              <Image src={addIcon} width={20} height={20} alt={event?.title} />
            </div>
          </div>}
          {isAdmin && <AdminActions event={event} events={events} setevents={setevents} />}
        </div>
      </div>
      {showBlog &&
        <div className={styles.main_blog_container}>
          <div className={styles.hide_blog_bar}>
            <button onClick={()=>setShowBlog(!showBlog)}>Close</button>
          </div>
          <BlogCard event={event} />
        </div>
      }
    </motion.div>
  )
}

export default TradingCard