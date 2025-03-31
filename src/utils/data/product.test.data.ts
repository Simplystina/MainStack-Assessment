export const reqAddProduct = {
  name: "Wireless Headphones",
  description:
    "Noise-canceling Bluetooth headphones with 40-hour battery life.",
  price: 129.99,
  category: "Electronics",
  stock: 50,
  image: "https://example.com/images/headphones-2.jpg",
};


export const reqGetProducts = [
  {
    name: "Wireless Headphones",
    description: "Noise-canceling Bluetooth headphones with 40-hour battery life.",
    price: 129.99,
    category: "Electronics",
    stock: 50,
    image: "https://example.com/images/headphones-2.jpg",
    createdAt: new Date("2023-05-15T10:00:00Z"),
    updatedAt: new Date("2023-05-15T10:00:00Z"),
    __v: 0
  },
  {
    name: "Durags",
    description: "Noise-canceling Bluetooth headphones with 40-hour battery life.",
    price: 129.99,
    category: "Electronics",
    stock: 50,
    image: "https://example.com/images/headphones-2.jpg",
    createdAt: new Date("2023-06-20T14:30:00Z"),
    updatedAt: new Date("2023-06-22T09:15:00Z"), // Simulate an update
    __v: 1
  }
];
