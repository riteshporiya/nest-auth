import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUser } from '../@types/users';
import { logAround } from 'src/app/logger/decorator/log-around';

export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  @logAround()
  public async registerNewUser(user: User): Promise<IUser> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedUser = await queryRunner.manager.save(user);
      await queryRunner.commitTransaction();
      return {
        userId: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        userName: savedUser.userName,
        mobileNo: savedUser.mobileNo,
        email: savedUser.email,
        role: savedUser.role,
        status: savedUser.status,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  @logAround()
  public async findOneUser(query: FindOneOptions<User>): Promise<IUser | null> {
    const user = await this.findOne(query);
    if (!user) {
      return null;
    }
    return {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      status: user.status,
      role: user.role,
      userName: user.userName,
      mobileNo: user.mobileNo,
    };
  }
}
