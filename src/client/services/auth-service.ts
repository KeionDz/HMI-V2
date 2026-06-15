export interface LoginDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const SIGNUP_ENDPOINT = `${API_BASE_URL}/auth/signup`;
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

async function getErrorMessage(response: Response) {
  try {
    const errorBody = (await response.json()) as ApiErrorResponse;
    const message = errorBody.message ?? errorBody.error;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }
  } catch {
    return response.statusText || "Authentication request failed";
  }

  return response.statusText || "Authentication request failed";
}

export async function signUp(signUpDto: SignUpDto) {
  const response = await fetch(SIGNUP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(signUpDto),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AuthUser;
}

export async function login(loginDto: LoginDto) {
  const response = await fetch(LOGIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(loginDto),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as LoginResponse;
}
