import { toast } from "sonner";

/**
 * A handy utility to simplify making API requests.
 *
 * It wraps fetch with error handling, loading state management,
 * success and error toasts, and optional success callbacks,
 * so we don’t have to write try/catch everywhere.
 *
 * Params:
 * 1: url: API endpoint to call.
 * 2: method: HTTP method (default is POST).
 * 3: body: data to send (will be JSON-stringified).
 * 4: onSuccess: callback for when the request succeeds.
 * 5: setLoading: function to toggle loading state.
 * 6: successMessage: message to show on success.
 * 7: headers: request headers (defaults to JSON).
 */
export const apiRequest = async ({
  url,
  method = "POST",
  body,
  onSuccess,
  setLoading,
  successMessage,
  headers = { "Content-Type": "application/json" },
}) => {
  try {
    setLoading?.(true);

    const fetchOptions = {
      method,
      headers,
    };

    if (body && method !== "GET" && method !== "HEAD") {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    toast.success(successMessage || "Success");
    onSuccess?.(result);
  } catch (error) {
    toast.error(error?.msg || "Something went wrong. Please try again later.");
  } finally {
    setLoading?.(false);
  }
};
