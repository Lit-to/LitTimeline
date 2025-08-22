import * as Response from "./types/response.ts";

const API_IP = import.meta.env.VITE_API_IP;
const API_PORT = import.meta.env.VITE_API_PORT;

async function getEndPoint(
    to: string,
): Promise<Response.ApiResponse> {
    try {
        const response = await fetch(`http://${API_IP}:${API_PORT}/${to}`, {
            method: "GET",
            credentials: "include",
            headers: {
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
        });

        return await responseToJson(response);
    } catch (error) {
        console.error("Error:", error);
        return Promise.resolve({result:{ isSuccess: false,reason:"",data:{}  }});
    }
}
async function postEndPoint(
    to: string,
    requestBody: object
): Promise<Response.ApiResponse> {
    try {
        const response = await fetch(`http://${API_IP}:${API_PORT}/${to}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Pragma: "no-cache",
                "If-Modified-Since": "0",
            },
            body: JSON.stringify(requestBody),
        });

        return await responseToJson(response);
    } catch (error) {
        console.error("Error:", error);
        return Promise.resolve({result:{ isSuccess: false,reason:"",data:{}  }});
    }
}

async function responseToJson(
    response: Response
): Promise<Response.ApiResponse> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export { responseToJson };

export { getEndPoint, postEndPoint };
