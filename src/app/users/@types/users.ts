export enum Status {
  ACTIVE = 0,
  INACTIVE = 1,
}

export interface IUser {
  userId: string;
  email: string;
  password?: string;
  userName: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  role: UserRole;
  status: Status;
}

export enum UserRole {
  USER = 0,
  ADMIN = 1,
}

export interface FindSuperAdminOptions {
  search: string;
  excludeMe: boolean;
}
