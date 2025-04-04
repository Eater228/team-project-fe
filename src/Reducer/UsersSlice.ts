import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "../Service/authService";
import { User } from "../type/User";

// Тип стану
interface UsersState {
  users: User[]; // Масив зареєстрованих користувачів
  currentUser: User | null; // Поточний авторизований користувач
  isLoggedIn: boolean; // Статус авторизації
}

// Початковий стан
const initialState: UsersState = {
  users: [],
  currentUser: JSON.parse(localStorage.getItem("currentUser") || "null"),
  // isLoggedIn: true,
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
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
    login: (
      state,
      action
    ) => {
      state.currentUser = action.payload; // Інші поля додаються тут
      state.isLoggedIn = true;

      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
      // console.log(state.currentUser)
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        // Оновлюємо тільки змінені поля
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        
        // Оновлюємо localStorage
        localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
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

      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

// Експорт дій
export const { register, login, updatePassword, logout, updateUser } = usersSlice.actions;

// Експорт ред'юсера
export default usersSlice.reducer;