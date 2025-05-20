import type { CreateItemInput, UpdateItemInput } from "@/lib/zodSchemas";
import type { Item } from "@/types/item";
import apiClient from "../lib/axios";

interface PaginatedItemsResponse {
  data: Item[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const getAllItems = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedItemsResponse> => {
  const response = await apiClient.get<PaginatedItemsResponse>("/item", {
    params: {
      page,
      limit,
    },
  });
  return response.data;
};

export const getItemById = async (itemId: number | string): Promise<Item> => {
  const response = await apiClient.get<Item>(`/item/${itemId}`);
  return response.data;
};

export const createItem = async (itemData: CreateItemInput): Promise<Item> => {
  const response = await apiClient.post<Item>("/item", itemData);
  return response.data;
};

export const updateItem = async (
  itemId: number | string,
  itemData: UpdateItemInput
): Promise<Item> => {
  const response = await apiClient.put<Item>(`/item/${itemId}`, itemData);
  return response.data;
};

export const deleteItem = async (
  itemId: number | string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/item/${itemId}`
  );
  return response.data;
};
