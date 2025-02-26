const serverCategories = [
  { id: 1, name: 'Art_Antiques', image: '/img/PhotoCategories/art.png' },
  { id: 2, name: 'Books', image: '/img/PhotoCategories/books.png' },
  { id: 3, name: 'Clothing_Footwear', image: '/img/PhotoCategories/Cloth.png' },
  { id: 4, name: 'Records', image: '/img/PhotoCategories/Records.png' },
  { id: 5, name: 'Transport', image: '/img/PhotoCategories/Transport.png' },
  { id: 6, name: 'Furniture', image: '/img/PhotoCategories/Furniture1.png' },
  { id: 7, name: 'Gadgets', image: '/img/PhotoCategories/gadgets.png' },
  { id: 8, name: 'Toys', image: '/img/PhotoCategories/toys1.png' },
  { id: 9, name: 'Collections', image: '/img/PhotoCategories/Collections.png' },
  { id: 10, name: 'Sports_Equipment', image: '/img/PhotoCategories/Sport.png' },
  { id: 11, name: 'Home_Appliances', image: '/img/PhotoCategories/home.png' },
  { id: 12, name: 'Other', image: '/img/PhotoCategories/SeeMoreNew.png' },
  // { id: 9, name: '', image: '' }, // Add an empty card
];


export const categories = serverCategories.map((category) => {
  return category
  // // Розділити назву по "_"
  // const splitName = category.name.split('_');
  
  // // Об'єднати назву через " & "
  // const formattedName = splitName.join(' & ');
  // Повернути об'єкт із оновленою назвою
  // return {
  //   ...category,
  //   name: formattedName
  // };
});
