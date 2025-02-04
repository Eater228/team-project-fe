import axios from "axios";

export const authClient = axios.create({
  baseURL: `http://localhost:8000`,
  withCredentials: true,
});

authClient.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem('accessToken');

  // Set Authorization header only for logout request
  if (request.url && request.url.endsWith('/logout') && accessToken) {
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
