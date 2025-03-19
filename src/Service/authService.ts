import { register, login, logout } from '../Reducer/UsersSlice';
import { User } from '../type/User'; // Adjust the import path as necessary
import { AppDispatch } from '../Store/Store'; // Adjust the import path as necessary
import { authClient as client } from "../http/auth"; // Adjust the import path as necessary

export const authService = {
  register: async (
    { first_name, last_name, email, password, repeatPassword }: RegisterCredentials,
    dispatch: AppDispatch
  ): Promise<any> => {
    if (password !== repeatPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }

    try {
      const response = await client.post('/account/register/', {
        email,
        first_name,
        last_name,
        password
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": ""
        }
      });

      const newUser = { email, first_name, last_name, password, };
      dispatch(register(newUser)); // Використовуємо переданий dispatch
      return response;
    } catch (error: any) {
      return Promise.reject(error.response?.data || error.message);
    }
  },

  login: async (
    { email, password }: LoginCredentials,
    dispatch: AppDispatch
  ): Promise<any> => {
    try {
      const response = await client.post("/account/token/", {
        email,
        password,
      });
  
      const { access, refresh } = response;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      const userProfile = await authService.foundUser(); // Отримуємо профіль користувача
      console.log(userProfile)
      
      if (userProfile) {
        dispatch(
          login(userProfile)
        ); // Оновлюємо стан
      }
  
      return response;
    } catch (error: any) {
      return Promise.reject(error.response?.data || error.message);
    }
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await client.post("/account/token/refresh/", { refresh: refreshToken });
    console.log(response.access)
    localStorage.setItem("accessToken", response.access);
    return response.access;
  },

  foundUser: async (): Promise<User | null> => {
    const accessToken = localStorage.getItem("accessToken");
  
    if (!accessToken) {
      return Promise.reject(new Error("Access token not found"));
    }

    try {
      const response = await client.get("/account/profile/", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Передаємо токен в заголовках
        },
      });
      
      return response; // Повертаємо дані профілю
    } catch (error: any) {
      return Promise.reject(error.response?.data || error.message);
    }
  },
  

  // logout: async (dispatch: AppDispatch): Promise<any> => {
  //   const accessToken = localStorage.getItem('accessToken');

  //   if (!accessToken) {
  //     return Promise.reject(new Error("Access token not found"));
  //   }

  //   try {
  //     await client.post('/account/logout/', {});
  //     localStorage.removeItem('accessToken');
  //     localStorage.removeItem('refreshToken');
  //     dispatch(logout()); // Використовуємо переданий dispatch
  //     return Promise.resolve();
  //   } catch (error: any) {
  //     return Promise.reject(error.response?.data || error.message);
  //   }
  // },
};
