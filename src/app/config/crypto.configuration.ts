import { ICryptOptions } from '../crypt/@types';
import * as fs from 'fs';

export const cryptoConfig = async () => {
  if (!process.env.CRYPTO_ALGORITHM) {
    throw new Error('CRYPTO_ALGORITHM environment variable is not defined.');
  }
  if (!process.env.CRYPTO_KEYPHRASS) {
    throw new Error('CRYPTO_KEYPHRASS environment variable is not defined.');
  }
  if (!Number(process.env.HASHING_SALT)) {
    throw new Error(
      'HASHING_SALT environment variable is not defined or is not of number type',
    );
  }
  let publicKey: string = '';
  let privateKey: string = '';
  if (!process.env.CRYPTO_PUBLIC_KEY) {
    if (!process.env.CRYPTO_PUBLIC_KEY_PATH) {
      throw new Error(
        'CRYPTO_PUBLIC_KEY_PATH environment variable is not defined.',
      );
    } else {
      publicKey = fs.readFileSync(process.env.CRYPTO_PUBLIC_KEY_PATH, 'utf8');
    }
  } else {
    publicKey = process.env.CRYPTO_PUBLIC_KEY;
  }

  if (!process.env.CRYPTO_PRIVATE_KEY) {
    if (!process.env.CRYPTO_PRIVATE_KEY_PATH) {
      throw new Error(
        'CRYPTO_PRIVATE_KEY_PATH environment variable is not defined.',
      );
    } else {
      privateKey = fs.readFileSync(process.env.CRYPTO_PRIVATE_KEY_PATH, 'utf8');
    }
  } else {
    privateKey = process.env.CRYPTO_PRIVATE_KEY;
  }
  return {
    cryptoConfig: {
      algorithm: process.env.CRYPTO_ALGORITHM,
      keyphrass: process.env.CRYPTO_KEYPHRASS,
      saltRound: Number(process.env.HASHING_SALT),
      privateKey,
      publicKey,
    } as ICryptOptions,
  };
};
