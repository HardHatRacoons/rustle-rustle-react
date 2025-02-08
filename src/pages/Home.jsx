import { RxAvatar } from "react-icons/rx";

function LoginNavbar() {
  return (
    <div className="w-full h-20 flex text-white align-items-center p-5">
      <div className="text-4xl grow-10 text-nowrap mx-2">Hello {"name"}!</div>
      <div className="underline italic text-2xl grow-1 mx-2">help</div>
      <RxAvatar size='40' />
    </div>
  )
}

function Home() {
  return (
  <div className="h-full bg-sky-300 flex flex-col">
        <LoginNavbar />
        <div className="bg-sky-200 grow">
              wah
            </div>
      </div>
  )
}

export default Home