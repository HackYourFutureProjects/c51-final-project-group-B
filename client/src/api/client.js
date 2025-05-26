// this function is used to make HTTP requests to the server .
// It takes a path and options object, constructs the full URL, and sends the request with the appropriate headers and body. It also handles errors and returns the response data in JSON format if applicable.
import { BASE_URL } from "../constants";

export async function httpClient(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const { headers = {}, ...rest } = options;

  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...rest,
    body:
      rest.body && typeof rest.body !== "string"
        ? JSON.stringify(rest.body)
        : rest.body,
  });

  const contentType = res.headers.get("Content-Type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok || (data && data.success === false)) {
    const message = data?.message || data?.error || data?.msg || res.statusText;
    throw new Error(message);
  }

  return data;
}
