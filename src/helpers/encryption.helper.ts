import bcrypt from "bcrypt";
export const hashValue = (value: string) => {
  return bcrypt.hash(value, 10);
};

export const compareValue = (enteredValue: string, hashedValue: string) =>
  bcrypt.compare(enteredValue, hashedValue);
