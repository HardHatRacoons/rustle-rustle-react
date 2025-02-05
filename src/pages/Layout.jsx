import { Outlet } from "react-router"
import Navbar from "../components/Navbar"

function Layout() {
  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  )
}

export default Layout
