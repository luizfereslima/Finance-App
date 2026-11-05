export interface SigninFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export type SigninField = keyof SigninFormValues;
export type SigninFormErrors = Partial<Record<SigninField, string>>;

/** Ordem em que os campos aparecem na tela (usada para focar o primeiro erro). */
export const SIGNIN_FIELDS: readonly SigninField[] = [
  "name",
  "email",
  "password",
  "passwordConfirmation",
];

// Mesmas regras do RegisterDto do backend (backend-financas/src/dtos.ts).
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 80;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 200;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSigninField(
  field: SigninField,
  values: SigninFormValues,
): string | undefined {
  switch (field) {
    case "name": {
      const name = values.name.trim();
      if (!name) return "Informe seu nome.";
      if (name.length < NAME_MIN_LENGTH)
        return `O nome deve ter pelo menos ${NAME_MIN_LENGTH} caracteres.`;
      if (name.length > NAME_MAX_LENGTH)
        return `O nome deve ter no máximo ${NAME_MAX_LENGTH} caracteres.`;
      return undefined;
    }
    case "email": {
      const email = values.email.trim();
      if (!email) return "Informe seu e-mail.";
      if (!EMAIL_PATTERN.test(email))
        return "Informe um e-mail válido, como nome@exemplo.com.";
      return undefined;
    }
    case "password": {
      const { password } = values;
      if (!password) return "Crie uma senha.";
      if (password.length < PASSWORD_MIN_LENGTH)
        return `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
      if (password.length > PASSWORD_MAX_LENGTH)
        return `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`;
      return undefined;
    }
    case "passwordConfirmation": {
      if (!values.passwordConfirmation) return "Confirme sua senha.";
      if (values.passwordConfirmation !== values.password)
        return "As senhas não coincidem.";
      return undefined;
    }
  }
}

export function validateSigninForm(values: SigninFormValues): SigninFormErrors {
  const errors: SigninFormErrors = {};
  for (const field of SIGNIN_FIELDS) {
    const message = validateSigninField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}
