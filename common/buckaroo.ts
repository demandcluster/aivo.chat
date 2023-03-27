import CryptoJS from 'crypto-js';

function getEncodedContent(content: string): string | undefined {
  if (content) {
    const md5 = CryptoJS.MD5(content);
    const base64 = CryptoJS.enc.Base64.stringify(md5);
    return base64;
  }

  return content;
}

function getHash(
  websiteKey: string,
  secretKey: string,
  httpMethod: string,
  nonce: string,
  timeStamp: number,
  requestUri: string,
  content: string
): string {
  const encodedContent = getEncodedContent(content);

  const rawData = websiteKey + httpMethod + requestUri + timeStamp + nonce + (encodedContent ?? '');
  const hash = CryptoJS.HmacSHA256(rawData, secretKey);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return hashInBase64;
}

function getTimeStamp(): number {
  return Math.floor(Date.now() / 1000);
}

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getAuthHeader(
  
  requestUri: string,
  websiteKey: string,
  secretKey: string,
  content: string,
  httpMethod: string
  
): string {
  const nonce = getNonce();
  const timeStamp = getTimeStamp();
  content = content || '';
  const url = encodeURIComponent(requestUri).toLowerCase();
  return `hmac ${websiteKey}:${getHash(websiteKey, secretKey, httpMethod, nonce, timeStamp, url, content)}:${nonce}:${timeStamp}`;
}
