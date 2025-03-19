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
import { AllCategoriesPage } from './Component/Categories/AllCategories/AllCategoriesPage'
import { MyAuctionsPage } from './Component/myAuctions/myAuctionsPage'
import { PrivacyStatement } from './Component/PrivacyStatement/PrivacyStatement'
import { CreatePage } from './Component/CreatePage/CreatePage'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { authService } from './Service/authService'
import { login } from './Reducer/UsersSlice'

export const Root = () => {
  const dispatch = useDispatch();

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
  
  

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPageFormik />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/refreshPasssword" element={<ResetPassword />} />
        <Route path="/" element={<App />}>
          <Route path="/Home" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/save" element={<FavoritePage />} />
          <Route path="/info/:itemId" element={<InfoPage />} />
          <Route path="/allCategories" element={<AllCategoriesPage />} />
          <Route path="/myAuctions" element={<MyAuctionsPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/privacyStatement" element={<PrivacyStatement />} />
        </Route>
      </Routes>
    </Router>
  );
};
