import { API_BASE_URL } from "@/client/services/api-config";

export interface CreateUserDto {
  name: string;
  username: string;
  password: string;
  role: string;
}

export interface User {
  id: string | number;
  name: string;
  username: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserResponse {
  message: string;
  data: User;
}

interface UserResponse {
  message: string;
  data: User;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const USERS_ENDPOINT = `${API_BASE_URL}/user`;

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

export async function getUserById(userId: string) {
  const response = await fetch(`${USERS_ENDPOINT}/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  const body = (await response.json()) as UserResponse;
  return body.data;
}
