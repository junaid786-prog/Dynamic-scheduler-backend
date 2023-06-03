import Link from "next/link"
import homeIcon from "../images/home_icon.png"
import foodIcon from "../images/food_icon.png"
import scienceIcon from "../images/science_icon.png"
import archiveIcon from "../images/archive_icon.png"

import navStyles from "../styles/navbar.module.css"
import Image from "next/image"
import { motion } from "framer-motion"
import Logo from "./Logo"
const Navbar = () => {
  return (
    <motion.nav
      className={navStyles.nav}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 210,
        damping: 20,
        // delay: 0.5,
      }}
    >
      <Logo />
      <div className={navStyles.nav_links}>
        <Link href="/">
          <Image src={homeIcon} width={20} height={20} alt="home icon" />
        </Link>
        <Link href="/food">
          <Image src={foodIcon} width={20} height={20} alt="food events" />
        </Link>
        <Link href="/science">
          <Image src={scienceIcon} width={20} height={20} alt="science events" />
        </Link>
        <Link href="/archives">
          <Image src={archiveIcon} width={20} height={20} alt="archives events" />
        </Link>
      </div>
    </motion.nav>
  )
}

export default Navbar