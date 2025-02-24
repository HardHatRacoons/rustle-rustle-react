import { useNavigate } from "react-router";

function NoPage() {
    const navigate = useNavigate();

    const back = () => {
      navigate('/');
    }

  return (
    <div className="select-none">
       Error. Page does not exist.
       <div onClick={back} aria-label="back">Click here to return to home.</div>
    </div>
  )
}

export default NoPage