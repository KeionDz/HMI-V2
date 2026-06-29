import { API_BASE_URL } from "@/client/services/api-config";

export interface CreateLayerDto {
  name: string;
  NumberOfPalletsAccomodated: string;
  active: boolean;
}

export interface Layer extends CreateLayerDto {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const CREATE_LAYER_ENDPOINT = `${API_BASE_URL}/layer/create`;

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
    return response.statusText || "Failed to create layer";
  }

  return response.statusText || "Failed to create layer";
}

export async function createLayer() {
  const response = await fetch(CREATE_LAYER_ENDPOINT, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Layer;
}
