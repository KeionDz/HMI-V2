import { API_BASE_URL } from "@/client/services/api-config";

export interface AddCameraDto {
  name: string;
  url: string;
  palletId: string;
}

export interface Camera {
  id: string;
  name: string;
  url: string;
  palletId: string;
  updatedAt?: string;
  pallet?: unknown;
}

type ApiErrorResponse = {
  message?: string | string[];
  error?: string;
};

//

const CAMERA_ENDPOINT = `${API_BASE_URL}/camera`;

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
    return response.statusText || "Camera request failed";
  }

  return response.statusText || "Camera request failed";
}

export async function addCamera(addCameraDto: AddCameraDto) {
  const response = await fetch(`${CAMERA_ENDPOINT}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(addCameraDto),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Camera;
}

export async function getCamera(id: string) {
  const response = await fetch(`${CAMERA_ENDPOINT}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Camera[];
}
