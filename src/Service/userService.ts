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
  async updateProfile(profileData: any) {
    console.log('profileData:', profileData);
    try {
      console.log('profileData:', JSON.stringify(profileData, null, 2));
      const response = await client.patch('/account/profile/', profileData);
      console.log('response:', response);
      return response;
      
    } catch (error: any) {
      console.error('Error updating profile:', error.response || error);
      throw error;
    }
  },
  async createAuctionLot(lotData: AuctionLotData) {
    try {
      const formData = new FormData();
      formData.append('item_name', lotData.item_name);
      formData.append('description', lotData.description);
      formData.append('location', lotData.location);
      formData.append('initial_price', lotData.initial_price);
      formData.append('min_step', lotData.min_step);
      formData.append('buyout_price', lotData.buyout_price);
      formData.append('close_time', lotData.close_time);
      formData.append('category', lotData.category.toString());

      if (lotData.images_to_upload) {
        lotData.images_to_upload.forEach((file) => {
          formData.append('images_to_upload', file);
        });
      }

      const response = await client.post('/api/auction-lots/', formData, {
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error: unknown) {
      console.error('Error creating auction lot:', error instanceof Error ? error.message : 'An unknown error occurred');
      throw error;
    }
  },
  async getProducts() {
    try {
      const response = await client.get('/api/auction-lots/');
      return response;
    } catch (error: any) {
      console.error('Error fetching products:', error.response || error);
      throw error;
    }
  },
  async getLotById(id: string) {
    try {
      const response = await client.get(`/api/auction-lots/${id}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching lot by ID:', error.response || error);
      throw error;
    }
  },
  async getCategories() {
    try {
      const response = await client.get('/api/categories/');
      // console.log(response);
      return response;
    } catch (error: any) {
      console.error('Error fetching categories:', error.response || error);
      throw error;
    }
  },
};