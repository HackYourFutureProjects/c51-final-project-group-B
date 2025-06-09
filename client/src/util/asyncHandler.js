import { toast } from "sonner";

export const asyncHandler = (fn) => (data) => {
  fn(data).catch((error) => {
    toast.error(error.msg || "Something went wrong.");
  });
};
