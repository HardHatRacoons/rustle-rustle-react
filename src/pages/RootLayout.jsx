import {Outlet} from "react-router"

function RootLayout() {
    //maybe delete this page bc its not rlly doing tooo much but we will see
  return (
    <div className="h-screen bg-sky-300">
        <Outlet/>
    </div>
  )
}

export default RootLayout