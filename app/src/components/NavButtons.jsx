import Link from "next/link"
import foodIcon from "../images/food_icon.png"
import scienceIcon from "../images/science_icon.png"
import archiveIcon from "../images/archive_icon.png"

import navStyles from "../styles/navbar.module.css"
import Image from "next/image"
const NavButtons = () => {
  return (
    <div className={navStyles.nav_buttons_bar}>
      <div className={navStyles.nav_buttons}>
        <Link href="/admin">
         <p>Admin</p>
        </Link>
        <Link href="/admin/create">
          <p>Schedule</p>
        </Link>
        <Link href="/events">
          <p>Events</p>
        </Link>
      </div>
    </div>
  )
}

export default NavButtons