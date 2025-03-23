import axios from "axios";

export const authClient = axios.create({
  baseURL: `http://localhost:8000`,
  // withCredentials: true,
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await authClient.post("/account/token/refresh/", {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem("accessToken", access);
    return access;
  } catch (error) {
    const typedError = error as any;
    console.error("Error refreshing token:", typedError.response?.data || typedError.message);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
    localStorage.setItem("isLoggedIn", "false");
    window.location.reload(); // Якщо токен не оновився — редірект на логін
    return null;
  }
};

// Додаємо заголовок Authorization для всіх запитів
authClient.interceptors.request.use(async (request) => {
  let accessToken = localStorage.getItem("accessToken");

  if (!accessToken && request.url !== "/account/token/refresh/") {
    accessToken = await refreshAccessToken();
  }

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});

// Перехоплення 401 помилок та оновлення токена
authClient.interceptors.response.use(
  (response) => response.data, // Убираємо `res.data` всюди
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (!newAccessToken) {
        return Promise.reject(error); // якщо токен не оновився, не повторюємо запит
      }

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return authClient(originalRequest);
    }

    return Promise.reject(error);
  }
);
