import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../constants';

export const InjectUserRepository = () => Inject(USER_REPOSITORY);
