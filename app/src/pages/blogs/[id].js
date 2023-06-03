import dynamic from "next/dynamic"
const BlogCard = dynamic(()=>import("@/src/components/EventCard"))
import CustomHead from "@/src/components/Head"
import styles from "@/src/styles/blog.module.css"


const Blog = ({ blog }) => {
    return (
        <>
            <CustomHead
                title="JBLOG | blog"
                description={blog[0]?.title}
                keyword="science events, food events"
            />
            <div className={styles.events_section}>
                {
                    <BlogCard blog={blog} />
                }
            </div>
        </>
    )
}

export default Blog


export async function getServerSideProps(context) {
    let { id } = context.query
    let url = process.env.BASE_URL + "events/" + id
    let res = await fetch(url)
    let blog = await res.json()

    return {
        props: {
            blog: blog.blog
        }
    }
}