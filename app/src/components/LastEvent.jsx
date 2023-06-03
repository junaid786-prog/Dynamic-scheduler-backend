import React from 'react'
import Event from './Event'
import styles from "../styles/events.module.css"
import Image from 'next/image'
const LastEvent = () => {
    let events =
        {
        title: "Event Title For Last Event Component",
        description: "E Event Description For Last Event Component E Event Description For Last Event C E Event Description For Last Event C",
        date: "Event Date",
        time: "Event Time",
        location: "Event Location",
        image: "Event Image",
        link: "https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZXZlbnRzfGVufDB8fDB8fHww&w=1000&q=80"
    }
  return (
    <div className={styles.last_event}>
        <div>
            <h1>{events.title}</h1>
            <Image src = {events.link} width={200} height={200} className={styles.last_event_img} />
            <p>{events.description?.substring(0, 50)}</p>
            <p>{events.date}</p>
            <p>{events.time}</p>
            <div>
            <button className = {styles.main_btn}>Join</button>
            </div>
        </div>
    </div>
  )
}

export default LastEvent