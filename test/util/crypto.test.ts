import { getRandomKey, encrypt, decrypt } from '../../src/util/crypto';
import { expect } from 'chai';

describe('(Util) crypto', () => {
  it('should encrypt and decrypt', () => {
    const key = getRandomKey(16);
    const text = 'Some text that we want to encrypt';

    const encrypted = encrypt(key, text);

    expect(encrypted).to.not.equal(text);

    const decrypted = decrypt(key, encrypted);

    expect(decrypted).to.equal(text);
  });
});
