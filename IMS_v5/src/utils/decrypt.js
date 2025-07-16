import CryptoJS from "crypto-js";

export const decryptValue = (encryptedText) => {
  const key = process.env.REACT_APP_SECRET_KEY; // or use a constant
  const bytes = CryptoJS.AES.decrypt(encryptedText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};