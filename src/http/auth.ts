import axios from "axios";

export const authClient = axios.create({
  baseURL: `http://localhost:8000`,
  // withCredentials: true,
});

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post("http://localhost:8000/account/token/refresh/", {
      refresh: refreshToken,
    });

    const { access } = response.data;
    localStorage.setItem("accessToken", access);
    return access;
  } catch (error) {
    console.error("Error refreshing token:", error);
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


// to awoid getting `res.data` everywhere
authClient.interceptors.response.use(
  response => response.data,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return authClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
