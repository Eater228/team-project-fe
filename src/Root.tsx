import {HashRouter as Router, Route, Routes} from 'react-router-dom'
import App from './App'
import { MainPage } from './Component/MainPage/MainPage'
import { Profile } from './Component/Profile/Profile'
import { ProductPage } from './Component/ProductPage/ProductPage'
import { TopPage } from './Component/TopPage/TopPage'
import { NewPage } from './Component/NewPage/NewPage'
import { AuthPage } from './Component/AuthPage/AuthPage'

export const Root = () => (
  <Router>
    <Routes>
        <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<App />}>
        <Route index element={<MainPage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/product' element={<ProductPage />} />
        <Route path='/top' element={<TopPage />} />
        <Route path='/new' element={<NewPage />} />
      </Route>
    </Routes>
  </Router>
)