import { Controller, Get, Header } from '@nestjs/common';
import { CryptoService } from '../crypt/crypto.service';
import { Public } from '../auth/decorators';
import { ApiTags } from '@nestjs/swagger';

@Controller('crypto')
@ApiTags('Crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('public-key')
  @Public()
  @Header('Content-Type', 'text/plain')
  async getPublicKey() {
    return this.cryptoService.publicKey;
  }
}
