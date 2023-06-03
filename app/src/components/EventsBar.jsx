import React from 'react'
import Event from './Event'
import styles from "../styles/events.module.css"
const EventsBar = ({events}) => {
  return (
    <div className={styles.event_bar}>
        {
            events.map((event) => {
                return <Event event={event} />
            })
        }
    </div>
  )
}

export default EventsBar