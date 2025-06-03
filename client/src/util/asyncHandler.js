import { toast } from "sonner";

export const asyncHandler = (fn) => (data) => {
  fn(data).catch((error) => {
    toast.error(error.message || "Something went wrong.", { duration: 5000 });
  });
};
