import { User } from "../type/User";
import { authClient as client } from "../http/auth";

interface ProfileData {
  email: string;
  first_name?: string;
  last_name?: string;
  profile_pic?: string | null;
  password?: string;
}

export const userService = {
  async updateProfile(profileData: ProfileData) {
    try {
      const response = await client.put('/account/profile/', profileData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error.response || error);
      throw error;
    }
  },
};


const API_URL = "http://localhost:3001"; // Змініть на реальну URL до вашої бази даних

// getUserById: async (id: number): Promise<User | null> => {
//   try {
//     const response = await axios.get<User[]>(`${API_URL}/users`); // Отримуємо масив користувачів
//     const user = response.data.find((user) => user.id === id); // Шукаємо користувача за ID
//     return user || null;
//   } catch (error) {
//     console.error("Error fetching user by ID:", error);
//     return null;
//   }
// },