import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/@types/users';
import { UserDTO as UserResDto } from './dto/response/user.dto';
import { UserService } from '../users/user.service';
import { UserDto as UserReqDto } from './dto/request/create-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthData } from '../auth/decorators/user.decorator';
import { AuthorizeResType } from '../auth/@types';
import { CustomValidationPipe } from '../common/CustomValidationPipe';
import { FindSuperAdminsResDto } from './dto/response/find-superadmins.dto';
import { FindSuperAdminsReqDto } from './dto/request/find-superadmins.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: FindSuperAdminsResDto,
    isArray: true,
  })
  @Roles(UserRole.ADMIN)
  @Get('/admins')
  public async getSuperAdmins(
    @Query(CustomValidationPipe) filter: FindSuperAdminsReqDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ): Promise<FindSuperAdminsResDto> {
    const usersPage = await this.userService.findSuperAdmins(
      filter,
      userAuthData.userId,
    );
    return {
      meta: usersPage.meta,
      items: usersPage.items.map(
        (user) =>
          ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
          }) as UserResDto,
      ),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Post('/superadmin')
  public async createSuperAdmin(@Body() body: UserReqDto): Promise<UserResDto> {
    const user = await this.userService.createSuperadmin(
      body.firstName,
      body.lastName,
      body.email,
      UserRole.ADMIN,
    );
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Put('/superadmin/:id')
  public async updateSuperAdmin(
    @Body() body: UserReqDto,
    @Param('id') id: string,
  ): Promise<UserResDto> {
    await this.userService.updateUserNamesOrEmail(
      id,
      body.firstName,
      body.lastName,
      body.email,
    );
    return {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      id: id,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully returned.',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Get('/superadmin/:id')
  public async getSuperAdmin(@Param('id') id: string): Promise<UserResDto> {
    const user = await this.userService.findSuperadminById(id);
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.userId,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted.',
    type: null,
  })
  @Roles(UserRole.ADMIN)
  @Delete('/superadmin/:id')
  public async deleteSuperAdmin(@Param('id') id: string): Promise<void> {
    await this.userService.deleteSuperAdmin(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Found record',
    type: UserResDto,
  })
  @Roles(UserRole.ADMIN)
  @Get('/user/:id')
  public async getUserById(@Param('id') id: string): Promise<UserResDto> {
    const user = await this.userService.findUserById(id);
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      id: user.userId,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'deleted record',
    type: null,
  })
  @Roles(UserRole.ADMIN)
  @Delete('user/:id')
  public async deleteUser(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
