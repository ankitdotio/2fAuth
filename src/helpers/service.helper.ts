import { TServiceSuccess } from "../types/service.type.js";

export const serviceSuccess = <T>(
  message: string,
  data: T,
): TServiceSuccess<T> => {
  return {
    success: true,
    message,
    data,
  };
};
