export type Product = {
  id: number;
  category: string;
  images: string[]; 
  name: string;
  itemId: number;
  fullPrice: number;
  startPrice: number;
  currentPrice: number;
  bet: number; // Мінімальна ціна, яку продавець прийме
  bids: { userId: number; amount: number; time: Date }[]; // Історія ставок
  seller: { id: number; name: string }; // Інформація про продавця
  status: "active" | "sold" | "expired"; // Статус товару
  // views: number; // Лічильник переглядів
  // tags: string[]; // Теги для пошуку
  location: string; // Місцезнаходження товару
  startingTime: Date; // Час початку аукціону
  endTime: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
