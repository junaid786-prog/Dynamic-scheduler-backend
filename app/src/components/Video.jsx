import { motion } from 'framer-motion'
import Image from 'next/image'
//import vid from "/video.mp4"
import banner from "../images/food_picture.png"
import playIcon from "../images/video_icon.png"

import styles from "../styles/components.module.css"

const Video = () => {
    return (
        <motion.section
        >
            <div className={styles.video_banner}>
                <Image src = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d29yayUyMGV2ZW50fGVufDB8fDB8fHww&w=1000&q=80" width={300} height={300} className={styles.video} />
            </div>
        </motion.section>
    )
}

export default Video