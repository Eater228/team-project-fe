import { useNavigate } from "react-router-dom"

export const MainPage = () => {
  const navigate = useNavigate();

  const redirectProfile = () => {
    navigate('/profile')
  }

  return (
    <div>
      Main Page

      <button onClick={redirectProfile}>profile</button>
    </div>
  )
}