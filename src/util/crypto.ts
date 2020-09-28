import crypto from 'crypto';
import Cryptr from 'cryptr';

function getRandomKey(byteLength: number = 32) {
  return crypto.randomBytes(byteLength).toString('base64');
}

/**
 * @memberOf util/crypto
 * @function encrypt
 * @desc encrypt text
 *
 * @param key
 * @param text
 */
function encrypt(key: string, text: string): string {
  const cryptr = new Cryptr(key);
  return cryptr.encrypt(text as string);
}

/**
 * @memberOf util/crypto
 * @function encrypt
 * @desc decrypt text
 *
 * @param key
 * @param encrypted
 */
function decrypt<V>(key: string, encrypted: string): string {
  const cryptr = new Cryptr(key);
  return cryptr.decrypt(encrypted);
}

/**
 * @module util/crypto
 */
export { getRandomKey, encrypt, decrypt };
