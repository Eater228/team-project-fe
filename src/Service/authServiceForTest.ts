import { authClient as client } from "../http/auth";
import store from '../Store/Store';
import { register, login, logout } from '../Reducer/UsersSlice';


type RegisterCredentials = {
  userName: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type LoginCredentials = {
  email: string;
  password: string;
};

export const authService = {
  register: ({ userName = '', first_name, last_name, email, password, repeatPassword }: RegisterCredentials): Promise<any> => {
    if (password !== repeatPassword) {
      return Promise.reject(new Error("Passwords do not match"));
    }

    const state = store.getState();
    const isExistingUser = state.userData.users.some(user => user.email === email);

    if (isExistingUser) {
      return Promise.reject(new Error("User with this email already exists"));
    }

    // console.log({email, first_name, last_name, password})

    const data = client.post('account/register/', { email, first_name, last_name, password })

    // console.log(data)

    const newUser = { username: userName, email, password };
    store.dispatch(register(newUser));
    return Promise.resolve(newUser);
  },

  login: ({ email, password }: LoginCredentials): Promise<any> => {
    store.dispatch(login({ email, password }));
    const state = store.getState();
    const user = state.userData.currentUser;

    if (user) {
      return Promise.resolve(user);
    } else {
      return Promise.reject(new Error("Invalid email or password"));
    }
  },

  refresh: (): Promise<any> => {
    return client.get('/refresh');
  },

  logout: (): Promise<any> => {
    store.dispatch(logout());
    return Promise.resolve();
  },
};