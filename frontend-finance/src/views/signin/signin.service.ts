import { api } from "@/utils/api";
import axios from "axios";

export interface SigninPayload {
  name: string;
  email: string;
  password: string;
}

export interface SigninUser {
  id: string;
  name: string;
  email: string;
}

/**
 * - `conflict`: e-mail já cadastrado (409)
 * - `validation`: dados recusados pela API (400)
 * - `network`: sem resposta do servidor (offline, CORS, API fora do ar)
 * - `server`: qualquer outra falha
 */
export type SigninErrorKind = "conflict" | "validation" | "network" | "server";

export class SigninError extends Error {
  readonly kind: SigninErrorKind;

  constructor(message: string, kind: SigninErrorKind, options?: ErrorOptions) {
    super(message, options);
    this.name = "SigninError";
    this.kind = kind;
  }
}

export async function signin(payload: SigninPayload): Promise<SigninUser> {
  try {
    const response = await api.post<SigninUser>("auth/register", payload);
    return response.data;
  } catch (error) {
    throw toSigninError(error);
  }
}

function toSigninError(error: unknown): unknown {
  if (!axios.isAxiosError(error)) return error;

  if (!error.response) {
    return new SigninError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      "network",
      { cause: error },
    );
  }

  switch (error.response.status) {
    case 409:
      return new SigninError("Este e-mail já está cadastrado.", "conflict", {
        cause: error,
      });
    case 400:
      return new SigninError(
        "Não foi possível criar a conta com os dados informados. Revise os campos e tente novamente.",
        "validation",
        { cause: error },
      );
    default:
      return new SigninError(
        "Não foi possível criar a conta agora. Tente novamente em instantes.",
        "server",
        { cause: error },
      );
  }
}
