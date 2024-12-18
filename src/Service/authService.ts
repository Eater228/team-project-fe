import { authClient as client } from "../http/auth";

type RegisterCredentials = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const authService = {
  register: ({ userName, firstName, lastName, email, password, repeatPassword }: RegisterCredentials): Promise<any> => {
    
    if(password !== repeatPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }

    return client.post('/registration', { userName, firstName, lastName, email, password });
  },

  login: ({ email, password }: LoginCredentials): Promise<any> => {
    return client.post('/login', { email, password });
  },

  refresh: (): Promise<any> => {
    return client.get('/refresh');
  },

  logout: (): Promise<any> => {
    return client.post('/logout');
  },
};