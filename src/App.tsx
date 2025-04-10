import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import { GridContainer } from './Component/GridContainer/GridContainer'
import { Header } from './Component/Header/Header'
import { Provider } from 'react-redux'
import store, { AppDispatch, RootState } from './Store/Store'
import { Footer } from './Component/Footer'
import { BackToTop } from './Component/BackToTop/BackToTop'
import { useSelector } from 'react-redux'
import { Notification } from './Component/NotificationPhonNumber/Notification'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchFavorites } from './Reducer/favoriteSlice'
import { authService } from './Service/authService'
import { login } from './Reducer/UsersSlice'

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.userData.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: any) => state.userData); // Adjust state type as needed
  const [verifyData, setVerifyData] = useState({
    isLoggedIn: false,
    phone_number: '',
  }); // Adjust state type as needed

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchFavorites());
    }
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    const reLogin = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const currentUser = localStorage.getItem("currentUser");
      const lastRefresh = localStorage.getItem("lastRefreshTokenTime");

      const now = Date.now();
      const FIFTEEN_MINUTES = 15 * 60 * 1000;

      if (isLoggedIn && currentUser) {
        if (!lastRefresh || now - Number(lastRefresh) >= FIFTEEN_MINUTES) {
          try {
            await authService.refreshToken(); // Оновлюємо токен
            localStorage.setItem("lastRefreshTokenTime", String(now)); // Зберігаємо час оновлення

            const user = JSON.parse(currentUser);
            dispatch(login(user)); // Передаємо звичайний об'єкт у dispatch

          } catch (error) {
            console.error("Failed to refresh token on page load:", error);
          }
        }
      }
    };

    reLogin();

    // Оновлення токена кожні 15 хвилин
    const interval = setInterval(reLogin, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  
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
