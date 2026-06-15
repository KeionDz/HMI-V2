export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserResponse {
  message: string;
  data: User;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

const USERS_ENDPOINT = `${API_BASE_URL}/users`;

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
    return response.statusText || "Failed to create user";
  }

  return response.statusText || "Failed to create user";
}

export async function createUser(createUserDto: CreateUserDto) {
  const response = await fetch(USERS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(createUserDto),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as CreateUserResponse;
}
