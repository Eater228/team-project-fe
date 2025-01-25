export type Product = {
  id: number;
  category: string;
  images: string[]; // Масив URL зображень товару
  name: string; // Назва товару
  fullPrice: number; // Повна ціна товару
  startPrice: number; // Стартова ціна на аукціоні
  currentPrice: number; // Поточна ціна товару (останній бід)
  bet: number; // Мінімальна ціна, яку продавець прийме
  bids: { userId: number; amount: number; time: string }[]; // Історія ставок
  seller: { id: number; name: string }; // Інформація про продавця
  status: "active" | "sold" | "expired"; // Статус товару
  state: "new" | "used"; // Стан товару
  location: string; // Місцезнаходження товару
  startingTime: string; // Час початку аукціону у форматі ISO 8601
  endTime: string; // Час завершення аукціону у форматі ISO 8601
  description: string; // Опис товару
  createdAt: string; // Дата створення у форматі ISO 8601
  updatedAt: string; // Дата оновлення у форматі ISO 8601
};