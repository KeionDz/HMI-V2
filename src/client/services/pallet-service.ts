import { API_BASE_URL } from "@/client/services/api-config";

export interface CreatePalletDto {
  label: string;
  description: string;
  taskId: string;
  palletCode: string;
  beginCell: string;
  endStation: string;
  isActive: boolean;
  layerId: string;
}

export interface Pallet extends CreatePalletDto {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

const CREATE_PALLET_ENDPOINT = `${API_BASE_URL}/pallet/create`;

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
    return response.statusText || "Failed to create pallet";
  }

  return response.statusText || "Failed to create pallet";
}

export async function createPallet(createPalletDto: CreatePalletDto) {
  const response = await fetch(CREATE_PALLET_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(createPalletDto),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Pallet;
}
