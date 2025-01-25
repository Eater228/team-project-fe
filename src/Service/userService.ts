import { User } from "../type/User";
import axios from "axios";

const API_URL = "http://localhost:3001"; // Змініть на реальну URL до вашої бази даних

export const userService = {
  getUserById: async (id: number): Promise<User | null> => {
    try {
      const response = await axios.get<User[]>(`${API_URL}/users`); // Отримуємо масив користувачів
      const user = response.data.find((user) => user.id === id); // Шукаємо користувача за ID
      return user || null;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return null;
    }
  },
};