import Button from "@/src/components/Button"
import CustomHead from "@/src/components/Head"
import Navbar from "@/src/components/Navbar"
import TradingCard from "@/src/components/TradingCard"
import styles from "@/src/styles/blog.module.css"
import Link from "next/link"

const Science = ({ events }) => {
  return (
    <>
      <CustomHead
        title="JBLOG | science blog"
        description="see variety of events here"
        keyword="science events, food events"
      />
      <Navbar />
      <div className={styles.events_section}>
        {
          events?.map((blog, index) => {
            return <TradingCard blog={blog} key={index} />
          })
        }
      </div>
      <div className={styles.full_flex}>
        <Link href="/archives"><Button name="Archives" /></Link>
      </div>
    </>
  )
}

export default Science

export async function getServerSideProps() {
  let url = process.env.BASE_URL + "events?category=science"
  let res = await fetch(url)
  const events = await res.json()
  return {
    props: events
  }
}
