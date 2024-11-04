import { Inject, Injectable } from '@nestjs/common';
import { CRYPTO_OPTIONS } from './constants';
import { ICryptOptions } from './@types';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class CryptoService {
  constructor(@Inject(CRYPTO_OPTIONS) private cryptoOption: ICryptOptions) {}

  public get publicKey(): string {
    return this.cryptoOption.publicKey;
  }

  protected get privateKey(): string {
    return this.cryptoOption.privateKey;
  }

  @logAround()
  public encrypt(text: string): string {
    const iv = Buffer.alloc(16, 0);
    const key = crypto.scryptSync(this.cryptoOption.keyphrass, 'salt', 32);
    const cipher = crypto.createCipheriv(this.cryptoOption.algorithm, key, iv);
    return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  }

  @logAround()
  public decrypt(encryptedText: string): string {
    const iv = Buffer.alloc(16, 0);
    const key = crypto.scryptSync(this.cryptoOption.keyphrass, 'salt', 32);
    const decipher = crypto.createDecipheriv(
      this.cryptoOption.algorithm,
      key,
      iv,
    );
    return (
      decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
    );
  }

  @logAround()
  public async hash(text: string): Promise<string> {
    return await bcrypt.hash(text, this.cryptoOption.saltRound);
  }

  @logAround()
  public async compareHash(hash: string, value: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  @logAround()
  public asymmetricEncrypt(text: string): string {
    const encrypted = crypto.publicEncrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      } as crypto.RsaPublicKey,
      Buffer.from(text, 'utf8'),
    );
    return encrypted.toString('base64');
  }

  @logAround()
  public asymmetricDecrypt(encryptedText: string): string {
    const decrypted = crypto.privateDecrypt(
      {
        key: this.privateKey,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encryptedText, 'base64'),
    );
    return decrypted.toString('utf8');
  }
}
