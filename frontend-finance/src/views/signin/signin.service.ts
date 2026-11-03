import { api } from "@/utils/api";
import axios from "axios";
export interface SigninPayload {
  name: string;
  email: string;
  password: string;
}
export interface SingInResponse {
  data: unknown;
  status: number;
}

interface SigninErrorResponse {
  message?: string;
}

export async function signin(payload: SigninPayload): Promise<SingInResponse> {
  try {
    const response = await api.post("auth/register", payload);
    return { data: response.data, status: response.status };
  } catch (error) {
    if (axios.isAxiosError<SigninErrorResponse>(error)) {
      throw new Error(
        error.response?.data?.message ?? "Não foi possivel criar a conta",
        { cause: error },
      );
    }
    throw error;
  }
}
