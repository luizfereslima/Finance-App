import { api } from "@/utils/api";
import axios from "axios";
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: unknown;
  status: number;
}

interface LoginErrorResponse {
  message?: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const response = await api.post("auth/login", payload);

    return { data: response.data, status: response.status };
  } catch (error) {
    if (axios.isAxiosError<LoginErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Email ou senha inválidos.",
        { cause: error },
      );
    }

    throw error;
  }
}
