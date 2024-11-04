import { DataSource } from 'typeorm';
import { USER_REPOSITORY } from '../constants';
import { DATA_SOURCE } from '../../db/constants';
import { UserRepository } from './user.repository';

export const userProvider = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => new UserRepository(dataSource),
    inject: [DATA_SOURCE],
  },
];
