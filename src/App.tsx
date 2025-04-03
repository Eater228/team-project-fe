import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import { GridContainer } from './Component/GridContainer/GridContainer'
import { Header } from './Component/Header/Header'
import { Provider } from 'react-redux'
import store from './Store/Store'
import { Footer } from './Component/Footer'
import { BackToTop } from './Component/BackToTop/BackToTop'
import { useSelector } from 'react-redux'
import { Notification } from './Component/Notification/Notification'
import { useEffect, useState } from 'react'

function App() {
  const userData = useSelector((state: any) => state.userData); // Adjust state type as needed
  const [verifyData, setVerifyData] = useState({
    isLoggedIn: false,
    phone_number: '',
  }); // Adjust state type as needed
  
  useEffect(() => {
    if(userData) {
      setVerifyData({
        isLoggedIn: userData.isLoggedIn,
        phone_number: userData.currentUser?.phone_number || '',
      });
    }
  }, [userData]);
  const location = useLocation()

  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <div className="Content" style={{ paddingTop: '80px' }}>
          {/* <GridContainer> */}
          <div className="Outlet">
            <Outlet />
          </div>
          {/* </GridContainer> */}
        </div>
        <Footer />
        {verifyData.isLoggedIn && !verifyData.phone_number && location.pathname !== '/profile' && (
          <Notification />
        )}
        <BackToTop />
      </div>
    </Provider>
  )
}

export default App
