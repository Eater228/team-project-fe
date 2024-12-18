import { useNavigate } from "react-router-dom";

export const ResetPage = () => {
  const navigate = useNavigate();

  return (
    <>
    <button onClick={() => navigate(-1)}>Back To Home</button>
    <div>
      <textarea name="email" id="" placeholder="Enter Email"></textarea>
    </div>
    </>
  )
}