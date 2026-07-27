import bcrypt from "bcrypt";
export const hashValue = (value: string) => {
  return bcrypt.hash(value, 10);
};
