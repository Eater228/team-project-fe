import axios from "axios";

export const authClient = axios.create({
  baseURL: `http://localhost:8000`,
  // withCredentials: true,
});

authClient.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem('accessToken');

  // Додаємо заголовок Authorization для всіх запитів, якщо токен існує
  if (accessToken && !request.url?.includes("/account/register/")) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});


// to awoid getting `res.data` everywhere
authClient.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  res => res.data,
  error => Promise.reject(error)
);
