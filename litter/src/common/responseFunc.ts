import { ApiResponse } from "../types/response";

async function responseToJson(response: Response): Promise<ApiResponse> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export {responseToJson};


