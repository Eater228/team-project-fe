import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import App from './App'
import { MainPage } from './Component/MainPage/MainPage'
import { Profile } from './Component/Profile/Profile'

export const Root = () => (
  <Router>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<MainPage />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
  </Router>
)