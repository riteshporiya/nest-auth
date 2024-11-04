import { Injectable } from '@nestjs/common';
import { IUser, UserRole } from '../users/@types/users';
import { ISignedTokens } from './@types';
import { AuthorizeResType, ITokenPayload } from './@types/payload';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../users/user.service';
import { RegisterAPIResponse } from '../rest/dto/response';
import { CryptoService } from '../crypt/crypto.service';
import { ErrorCode } from '../exceptions/error-codes';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { logAround } from '../logger/decorator/log-around';
import { CustomException } from '../exceptions/custom-exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService<ITokenPayload>,
    private userService: UserService,
    private cryptoService: CryptoService,
  ) {}

  @logAround()
  public async signUp(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<RegisterAPIResponse> {
    const decryptedPassword = this.cryptoService.asymmetricDecrypt(password);
    const hashedPassword = await this.cryptoService.hash(decryptedPassword);
    const newUser = await this.userService.register(
      email,
      hashedPassword,
      role,
    );
    const tokens = this.signUserIn(newUser);
    return {
      ...tokens,
      emailVerified: false,
    };
  }

  @logAround()
  public async login(
    email: string,
    password: string,
    allowedRoles: UserRole[],
  ) {
    const user = await this.userService.findUserByEmailAndRole(
      email,
      allowedRoles,
    );

    console.log(JSON.stringify(user));

    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }

    const decryptedPassword = this.cryptoService.asymmetricDecrypt(password);
    if (!user.password) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }
    const isPasswordCorrect = await this.cryptoService.compareHash(
      user.password,
      decryptedPassword,
    );

    if (!isPasswordCorrect) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }

    const tokens = this.signUserIn(user);

    return {
      ...tokens,
      role: user.role,
    };
  }

  @logAround()
  private signUserIn(newUser: IUser): ISignedTokens {
    const accessToken = this.jwtService.signAccessToken({
      userId: newUser.userId,
      email: newUser.email,
    });
    const refreshToken = this.jwtService.signRefreshToken({
      userId: newUser.userId,
      email: newUser.email,
    });
    return {
      accessToken,
      accessTokenExpireIn: this.jwtService.accessTokenExpireIn,
      refreshToken,
      refreshTokenExpireIn: this.jwtService.refreshTokenExpireIn,
    };
  }

  @logAround()
  async forgotPassword(email: string, allowedRoles: UserRole[]) {
    const user = await this.userService.findUserByEmailAndRole(
      email,
      allowedRoles,
    );
    if (user) {
      return user;
    } else {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }

  async validateCredentialsAndEditUser(
    credentials: { email: string; password: string; role: UserRole },
    userData: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    try {
      await this.login(credentials.email, credentials.password, [
        credentials.role,
      ]);
    } catch (e) {
      if (e instanceof CustomException) {
        if (e.code === ErrorCode.WRONG_CREDENTIALS) {
          throw CustomExceptionFactory.create(
            ErrorCode.WRONG_PASSWORD_FOR_EDIT_USER,
          );
        }
      }
      throw e;
    }
    const decryptedPassword = this.cryptoService.asymmetricDecrypt(
      userData.password,
    );
    const hashedPassword = await this.cryptoService.hash(decryptedPassword);
    await this.userService.updateUserWithPassword(
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.email,
      hashedPassword,
    );
    return {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
  }

  @logAround()
  public async authorize(userId: string): Promise<AuthorizeResType> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.NOT_AUTHORIZED);
    }
    return {
      role: user.role,
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
