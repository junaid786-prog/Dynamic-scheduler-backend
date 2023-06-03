import CustomHead from "@/src/components/Head"
import styles from "@/src/styles/blog.module.css"
import Navbar from "@/src/components/Navbar"
import { useState } from "react"
import ArchiveBlogCard from "@/src/components/ArchiveBlog"


const Blog = ({ events }) => {
  const [category, setCategory] = useState("")
  return (
    <>
      <CustomHead
        title="JBLOG | archive events"
        description="see variety of events here"
        keyword="science events, food events"
      />
      <Navbar />
      <div className={styles.archive_events_part}>
        <div className={styles.filteration_bar}>
          <button onClick={() => setCategory("")} style={{ backgroundColor: category === "" && "gray" }} > All </button>
          <button onClick={() => setCategory("science")} style={{ backgroundColor: category === "science" && "gray" }} > Science </button>
          <button onClick={() => setCategory("food")} style={{ backgroundColor: category === "food" && "gray" }} > Food </button>
        </div>
        <div className={styles.archive_events_section}>
          {
            events.filter(b => b.category?.includes(category)).map((blog, index) => {
              return <ArchiveBlogCard blog={blog} key={index} />
            })
          }
        </div>
      </div>
    </>
  )
}

export default Blog

export async function getServerSideProps() {
  let url = process.env.BASE_URL + "events/archives"
  let res = await fetch(url)
  const events = await res.json()
  return {
    props: events
  }

}
