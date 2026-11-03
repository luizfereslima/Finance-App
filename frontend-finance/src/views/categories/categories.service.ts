import { api } from "@/utils/api";

export type CategoryType = "expense" | "income";

type ApiCategoryType = "EXPENSE" | "INCOME";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  transactionCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory extends Omit<Category, "type"> {
  type: ApiCategoryType;
}

interface CategoriesResponse {
  data: ApiCategory[];
  meta?: { total: number };
}

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

let cachedCategories: Category[] = [];

function toCategory(category: ApiCategory): Category {
  return {
    ...category,
    type: category.type === "INCOME" ? "income" : "expense",
  };
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<CategoriesResponse | ApiCategory[]>(
    "categories",
  );
  const data = Array.isArray(response.data)
    ? response.data
    : response.data.data;

  cachedCategories = data.map(toCategory);

  return cachedCategories;
}

export async function createCategory(
  name: string,
  type: CategoryType,
): Promise<Category> {
  const response = await api.post<ApiCategory | { data: ApiCategory }>(
    "categories",
    {
      name,
      type: type === "income" ? "INCOME" : "EXPENSE",
    },
  );
  const data = response.data;

  return toCategory("data" in data ? data.data : data);
}

export async function updateCategory(
  id: string,
  name: string,
  type: CategoryType,
): Promise<Category> {
  const response = await api.patch<ApiCategory | { data: ApiCategory }>(
    `categories/${id}`,
    {
      name,
      type: type === "income" ? "INCOME" : "EXPENSE",
    },
  );
  const data = response.data;

  return toCategory("data" in data ? data.data : data);
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`categories/${id}`);
}

export const categoriesService = {
  getCategories(): Category[] {
    return cachedCategories;
  },
};
