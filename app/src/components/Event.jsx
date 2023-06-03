import React from 'react'
import styles from "../styles/events.module.css"
import Image from 'next/image'
const Event = ({event}) => {
  return (
    <div className={styles.event_card}>
        <h1>{event.title}</h1>
        <Image src={event?.link} width={200} height={200} className={styles.event_img} />
        <p>{event.description?.substring(0, 20)}</p>
        <p>{event.date}</p>
        <p>{event.time}</p>
        <button className = {styles.main_btn}>Join</button>
    </div>
  )
}

export default Event