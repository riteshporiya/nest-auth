import { Inject } from '@nestjs/common';
import { DATA_SOURCE } from '../db/constants';
import { FindSuperAdminOptions, IUser, Status, UserRole } from './@types/users';
import { Brackets, DataSource, In, Not } from 'typeorm';
import { logAround } from '../logger/decorator/log-around';
import {
  PageService,
  PaginationFilter,
  PaginationResponse,
} from '../common/pagination';
import { InjectUserRepository } from './decorators/inject-user-repository';
import { UserRepository } from './providers/user.repository';
import { User } from './entities/user.entity';
import { ErrorCode } from '../exceptions/error-codes';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { SortOrder } from '../common/@types';

export class UserService extends PageService<User> {
  constructor(
    @InjectUserRepository()
    private readonly userRepository: UserRepository,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
  ) {
    super(userRepository);
  }

  @logAround({
    ignoreArgs: false,
    ignoreReturn: false,
  })
  public async createOrUpdateMasterAdminUser(
    email: string,
    hashedPassword: string,
  ) {
    const masterAdminUsers = await this.findUsersByRole(UserRole.ADMIN);
    if (masterAdminUsers && masterAdminUsers.length > 0) {
      return;
    }
    const masterAdmin = new User();
    masterAdmin.email = email;
    masterAdmin.firstName = 'Super';
    masterAdmin.lastName = 'Admin';
    masterAdmin.userName = 'super_admin';
    masterAdmin.password = hashedPassword;
    masterAdmin.status = Status.ACTIVE;
    masterAdmin.role = UserRole.ADMIN;
    return this.userRepository.save(masterAdmin);
  }

  @logAround()
  public async register(
    email: string,
    password: string,
    role: UserRole,
  ): Promise<IUser> {
    const checkExists = await this.checkUserExistsByEmail(email);
    if (checkExists) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = 'Test';
    newUser.lastName = 'User';
    newUser.password = password;
    newUser.role = role;
    const savedUser = await this.userRepository.registerNewUser(newUser);
    return savedUser;
  }

  @logAround()
  public async findSuperAdmins(
    filter: PaginationFilter & FindSuperAdminOptions,
    userId: string,
  ): Promise<PaginationResponse<User>> {
    const query = this.userRepository.createQueryBuilder('user');
    if (filter.search) {
      query.where(
        new Brackets((qb) => {
          qb.orWhere(
            `CONCAT(user.firstName, ' ', user.lastName) ILIKE :search`,
            {
              search: `%${filter.search}%`,
            },
          )
            .orWhere(
              `CONCAT(user.lastName, ' ', user.firstName) ILIKE :search`,
              {
                search: `%${filter.search}%`,
              },
            )
            .orWhere('user.email ILIKE :search', {
              search: `%${filter.search}%`,
            });
        }),
      );
    }
    query.andWhere('user.role = :role', {
      role: UserRole.ADMIN,
    });
    if (filter.excludeMe) {
      query.andWhere('user.id != :userId', { userId });
    }
    if (filter.orderBy) {
      query.orderBy(
        `"${filter.orderBy}"`,
        filter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
      );
    } else {
      query.orderBy('user.createdAt', 'DESC');
    }
    query.skip((filter.page - 1) * filter.pageSize);
    query.take(filter.pageSize);

    const [data, total] = await query.getManyAndCount();

    return {
      items: data,
      meta: {
        currentPage: filter.page,
        itemsPerPage: filter.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / filter.pageSize),
        itemCount: data.length,
      },
    };
  }

  @logAround()
  public async checkUserExistsByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return !!user;
  }

  @logAround()
  public async findUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: {
        role,
      },
    });
  }

  @logAround()
  public async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    return { userId: user.id, ...user };
  }

  @logAround()
  public async updateUserWithPassword(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: {
        email,
        id: Not(id),
      },
    });
    if (user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    return this.userRepository.update(
      { id },
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    );
  }

  @logAround()
  public async findUserByEmailAndRole(
    email: string,
    role: UserRole[],
  ): Promise<IUser> {
    return this.userRepository.findOneUser({
      where: {
        email,
        role: In(role),
      },
    });
  }

  @logAround()
  public async createSuperadmin(
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
  ) {
    const foundUser = await this.findUserByEmail(email);
    if (foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.role = role;
    const user = await this.userRepository.save(newUser);
    return user;
  }

  @logAround()
  public async findUserByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOneUser({
      where: {
        email,
      },
    });
  }

  @logAround()
  public async updateUserNamesOrEmail(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
        role: UserRole.ADMIN,
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: Not(id),
        email,
      },
    });
    if (user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    await this.userRepository.update(
      { id },
      {
        firstName,
        lastName,
        email,
      },
    );
    if (foundUser.email !== email) {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      return user;
    }
  }

  @logAround()
  public async findSuperadminById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneUser({
      where: {
        id,
      },
    });
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  @logAround()
  public async deleteSuperAdmin(id: string) {
    const { affected } = await this.userRepository.delete({
      id,
      role: UserRole.ADMIN,
    });
    if (affected < 1) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }

  @logAround()
  public async deleteUser(id: string) {
    const { affected } = await this.userRepository.delete({
      id,
      role: In([UserRole.ADMIN, UserRole.USER]),
    });
    if (affected < 1) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }
}
