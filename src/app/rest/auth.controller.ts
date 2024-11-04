import { Body, Controller, Get, HttpCode, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckUserExistsAPIBody,
  ForgotPasswordAPIBody,
  LoginAPIBody,
  RegisterAPIBody,
} from './dto/request';
import {
  CheckUserExistsAPIResponse,
  CurrentUserAPIResponse,
  LoginAPIResponse,
  RegisterAPIResponse,
} from './dto/response';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { Public } from '../auth/decorators';
import { UserAuthData } from '../auth/decorators/user.decorator';
import { AuthorizeResType } from '../auth/@types/payload';
import { EditMeDto } from './dto/request/edit-user.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('/register')
  @ApiResponse({ status: 200, type: RegisterAPIResponse })
  public async register(@Body() body: RegisterAPIBody) {
    return this.authService.signUp(body.email, body.password, body.role);
  }

  @Public()
  @Post('/login')
  @ApiResponse({ status: 200, type: LoginAPIResponse })
  public async login(@Body() body: LoginAPIBody) {
    return this.authService.login(body.email, body.password, [body.role]);
  }

  @Public()
  @HttpCode(200)
  @Post('/forgot-password')
  @ApiResponse({ status: 200, type: null })
  public async forgotPassword(@Body() body: ForgotPasswordAPIBody) {
    await this.authService.forgotPassword(body.email, [body.role]);
  }

  @HttpCode(200)
  @Get('/current-user')
  @ApiResponse({ status: 200, type: CurrentUserAPIResponse })
  public async currentUser(
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CurrentUserAPIResponse> {
    const userDoc = await this.userService.findUserById(user.userId);
    return {
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      role: userDoc.role,
    };
  }

  @HttpCode(200)
  @Public()
  @Post('/check-user-exists')
  @ApiResponse({ status: 200, type: CheckUserExistsAPIResponse })
  public async checkUserExists(
    @Body() body: CheckUserExistsAPIBody,
  ): Promise<CheckUserExistsAPIResponse> {
    try {
      const user = await this.userService.findUserByEmail(body.email);
      return {
        exists: !!user,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        exists: false,
      };
    }
  }

  @Get('/authorize')
  public async authorize(@UserAuthData() userAuthData: AuthorizeResType) {
    return userAuthData;
  }

  @Put('/edit/me')
  public async editMe(
    @Body() body: EditMeDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ) {
    await this.authService.validateCredentialsAndEditUser(
      {
        email: userAuthData.email,
        password: body.currentPassword,
        role: userAuthData.role,
      },
      {
        id: userAuthData.userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.newPassword,
      },
    );
  }
}
