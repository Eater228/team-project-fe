import { User } from "../type/User";
import { authClient as client } from "../http/auth";
import { Product } from "type/Product";

interface ProfileData {
  email: string;
  first_name?: string;
  last_name?: string;
  profile_pic?: string | null;
  password?: string;
}

export interface AuctionLotData {
  item_name: string;
  description: string;
  location: string;
  initial_price: string;
  min_step: string;
  buyout_price: string;
  close_time: string;
  category: number;
  images_to_upload?: File[];
}

export const userService = {
  async updateProfile(profileData: ProfileData) {
    try {
      const response = await client.put('/account/profile/', profileData);
      return response;
    } catch (error: any) {
      console.error('Error updating profile:', error.response || error);
      throw error;
    }
  },
  async createAuctionLot(lotData: AuctionLotData) {
    try {
      const formData = new FormData();
      
      // Додаємо текстові поля
      formData.append('item_name', lotData.item_name);
      formData.append('description', lotData.description);
      formData.append('location', lotData.location);
      formData.append('initial_price', lotData.initial_price);
      formData.append('min_step', lotData.min_step);
      formData.append('buyout_price', lotData.buyout_price);
      formData.append('close_time', lotData.close_time);
      formData.append('category', lotData.category);
      
      // Додаємо файли
      if (lotData.images_to_upload) {
        lotData.images_to_upload.forEach((file, index) => {
          formData.append(`images_to_upload`, file);
        });
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await client.post('/api/auction-lots/', formData, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating auction lot:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
      throw error;
    }
  },
  async getProducts() {
    try {
      const response = await client.get('/api/auction-lots/')
      return response;
    } catch (error: any) {
      console.error('Error', error.response || error);
      throw error;
    }
  },

  async getLotById (id: string) {
    const response = await client.get(`/api/auction-lots/${id}`);
    return response;
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