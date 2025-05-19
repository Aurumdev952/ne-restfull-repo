import { v4 as uuidv4 } from "uuid"; // npm install uuid @types/uuid
import type { Item } from "../types/item";

let mockItems: Item[] = [
  {
    id: uuidv4(),
    name: "Laptop Pro",
    description: "High-performance laptop for professionals.",
    category: "Electronics",
    price: 1200,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150/A8D8EA/000000?Text=Laptop",
  },
  {
    id: uuidv4(),
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse.",
    category: "Accessories",
    price: 25,
    stock: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150/AEF3E7/000000?Text=Mouse",
  },
  {
    id: uuidv4(),
    name: "Mechanical Keyboard",
    description: "RGB Mechanical Keyboard.",
    category: "Accessories",
    price: 75,
    stock: 70,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150/A8D8EA/000000?Text=Keyboard",
  },
  {
    id: uuidv4(),
    name: "4K Monitor",
    description: "27-inch 4K UHD Monitor.",
    category: "Electronics",
    price: 300,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150/AEF3E7/000000?Text=Monitor",
  },
  {
    id: uuidv4(),
    name: "Standing Desk",
    description: "Adjustable height standing desk.",
    category: "Furniture",
    price: 400,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    imageUrl: "https://via.placeholder.com/150/A8D8EA/000000?Text=Desk",
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const getItems = async (
  page = 1,
  limit = 10,
  filters: Record<string, string> = {}
): Promise<{ items: Item[]; total: number }> => {
  await delay(500);
  let filteredItems = [...mockItems];

  if (filters.name) {
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }
  if (filters.category) {
    filteredItems = filteredItems.filter(
      (item) => item.category.toLowerCase() === filters.category.toLowerCase()
    );
  }

  const total = filteredItems.length;
  const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);
  return { items: paginatedItems, total };
};

export const getItemById = async (id: string): Promise<Item | undefined> => {
  await delay(300);
  return mockItems.find((item) => item.id === id);
};

export const createItem = async (
  itemData: Omit<Item, "id" | "createdAt" | "updatedAt">
): Promise<Item> => {
  await delay(500);
  const newItem: Item = {
    ...itemData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockItems.unshift(newItem);
  return newItem;
};

export const updateItem = async (
  id: string,
  itemData: Partial<Omit<Item, "id" | "createdAt" | "updatedAt">>
): Promise<Item | undefined> => {
  await delay(500);
  const itemIndex = mockItems.findIndex((item) => item.id === id);
  if (itemIndex === -1) return undefined;
  mockItems[itemIndex] = {
    ...mockItems[itemIndex],
    ...itemData,
    updatedAt: new Date().toISOString(),
  };
  return mockItems[itemIndex];
};

export const deleteItem = async (id: string): Promise<boolean> => {
  await delay(500);
  const initialLength = mockItems.length;
  mockItems = mockItems.filter((item) => item.id !== id);
  return mockItems.length < initialLength;
};

export const getItemCategories = async (): Promise<string[]> => {
  await delay(200);
  const categories = new Set(mockItems.map((item) => item.category));
  return Array.from(categories);
};
