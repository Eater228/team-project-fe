import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import App from './App'
import { MainPage } from './Component/MainPage/MainPage'
import { Profile } from './Component/Profile/Profile'
import { ProductPage } from './Component/ProductPage/ProductPage'
import { TopPage } from './Component/TopPage/TopPage'
import { NewPage } from './Component/NewPage/NewPage'
import { AuthPage } from './Component/AuthPage/AuthPage'
import { ResetPage } from './Component/ResetPage/ResetPage'
import { AuthPageFormik } from './Component/AuthPage/AuthPageFormik'
import { ForgotPassword } from './Component/AuthPage/ForgotPassword/ForgotPassword'
import { ResetPassword } from './Component/AuthPage/ResetPassword/ResetPassword'
import { InfoPage } from './Component/InfoPage/InfoPage'
import { FavoritePage } from './Component/FavoritePage/FavoritePage'

export const Root = () => (
  <Router>
    <Routes>
        {/* <Route path='/auth' element={<AuthPage />} /> */}
        <Route path='/auth' element={<AuthPageFormik />} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          <Route path='/reset' element={<ResetPage />} />
          <Route path='/refreshPasssword' element={<ResetPassword/>} />
      <Route path='/' element={<App />}>
        <Route path='/Home' element={<MainPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product' element={<ProductPage />} />
        <Route path='/save' element={<FavoritePage />} />
        <Route path='/info/:itemId' element={<InfoPage />} />
      </Route>
    </Routes>
  </Router>
)