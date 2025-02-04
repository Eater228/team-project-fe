import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../Service/authService";

// Тип для одного користувача
interface User {
  username: string;
  email: string;
  accessToken?: string;
  password?: string;
}

// Тип стану
interface UsersState {
  users: User[]; // Масив зареєстрованих користувачів
  currentUser: User | null; // Поточний авторизований користувач
  isLoggedIn: boolean; // Статус авторизації
}

// Початковий стан
const initialState: UsersState = {
  users: [],
  currentUser: null,
  isLoggedIn: false,
};


// Створення slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Реєстрація нового користувача
    register: (state, action: PayloadAction<User>) => {
      const newUser = action.payload;
      const isExistingUser = state.users.some(
        (user) => user.email === newUser.email
      );

      if (!isExistingUser) {
        state.users.push(newUser); // Додати нового користувача
      } else {
        console.error("User with this email already exists");
      }
    },

    // Авторизація користувача
    login: (
      state,
      action: PayloadAction<{ email: string; accessToken: string }>
    ) => {
      const { email, accessToken } = action.payload;
      const foundUser = state.users.find((user) => user.email === email);
console.log(state)
      if (foundUser) {
        state.currentUser = { ...foundUser, accessToken }; // Зберегти поточного користувача з токеном
        state.isLoggedIn = true; // Встановити статус авторизації
      } else {
        console.error("User not found");
      }
    },

    // Оновлення пароля користувача
    updatePassword: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      const userIndex = state.users.findIndex(
        (user) => user.email === action.payload.email
      );
      if (userIndex !== -1) {
        state.users[userIndex].password = action.payload.password;
      }
    },

    // Вихід з системи
    logout: (state) => {
      state.currentUser = null; // Видалити поточного користувача
      state.isLoggedIn = false; // Скинути статус авторизації
    },
  },
});

// Експорт дій
export const { register, login, updatePassword, logout } = usersSlice.actions;

// Експорт ред'юсера
export default usersSlice.reducer;