import CryptoJS from 'crypto-js';

const secretKey = process.env.REDUX_ENCRYPTION_SCRECT_KEY; // Replace with a strong secret key

export const encrypt = (data) => {
  console.log(secretKey, "secretKey");
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
};

export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
