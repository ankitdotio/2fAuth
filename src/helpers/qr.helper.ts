import qrcode from "qrcode";

export const createQRCodeDataUrl = (data: string) => {
  return qrcode.toDataURL(data);
};
