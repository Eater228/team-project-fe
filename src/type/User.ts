export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  profile_pic?: string;
  balance?: number;
  phone_number?: string;        // Змінено з phone_number
  telegram?: string;
  instagram?: string;
  viber?: boolean;
};