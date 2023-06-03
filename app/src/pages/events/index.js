import Button from "@/src/components/Button"
import CustomHead from "@/src/components/Head"
import Navbar from "@/src/components/Navbar"
import styles from "@/src/styles/blog.module.css"
import requestConfig from "@/src/utils/config"
import axios from "axios"
import dynamic from "next/dynamic"
import Link from "next/link"

const TradingCard = dynamic(()=>import("@/src/components/TradingCard"))
const Events = ({ events }) => {
  return (
    <>
      <CustomHead
        title="JBLOG | food events"
        description="see variety of events here"
        keyword="science events, food events"
      />
      <Navbar />
      <div className={styles.events_section}>
        {
          events?.map((event, index) => {
            return <TradingCard event={event} key={index} />
          })
        }
      </div>
      <div className={styles.full_flex}>
        <Link href="/archives"><Button name="Archives" /></Link>
      </div>
    </>
  )
}

export default Events

export async function getServerSideProps() {
  let url = process.env.BASE_URL + "events"
  let res = await axios.get(url, requestConfig)
  return {
    props: res.data
  }

}
