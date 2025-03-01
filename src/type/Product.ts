// export type Product = {
//   item_name: string; // Назва товару (замість item_name)
//   description: string; // Опис товару
//   location: string; // Місцезнаходження товару
//   category: number; // Категорія товару (числовий ідентифікатор)
//   initial_price: number; // Початкова ціна (з initial_price)
//   min_step: number; // Мінімальний крок (з min_step)
//   buyout_price: number; // Ціна викупу (з buyout_price)
//   close_time: string; // Час завершення аукціону (ISO 8601)
//   images: string[]; // Масив URL зображень

//   // Опціональні поля (якщо вони можуть бути у майбутньому)
//   createdAt?: string; // Дата створення (якщо буде)
//   updatedAt?: string; // Дата оновлення (якщо буде)
// };

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