import axios from "axios"
import Banner from "../components/Banner"
import EventsBar from "../components/EventsBar"
import CustomHead from "../components/Head"
import LastEvent from "../components/LastEvent"
import Logo from "../components/Logo"
import NavButtons from "../components/NavButtons"
import homeStyles from "../styles/home.module.css"
import requestConfig from "../utils/config"

export default function Home({ events }) {
  return (
    <>
      <CustomHead
        title="JBLOG | home"
        description="see all science events here"
        keyword="science events, food events"
      />
      <Logo />
      <div className={homeStyles.nav_buttons}>
        <NavButtons />
      </div>
      <section>
        <Banner/>
      </section>
      <section className={homeStyles.main_events}>
        <h3>
          Upcoming Events
        </h3>
        <EventsBar events = {events} />
      </section>
      <section className={homeStyles.main_events}>
        <h3>
          Last Event
        </h3>
        <LastEvent />
      </section>
      {/* <NavButtons /> */}
    </>
  )
}



export async function getServerSideProps() {
  let url = process.env.BASE_URL + "events"
  let res = await axios.get(url, requestConfig)
  console.log(res.data)
  return {
    props: res.data
  }

}