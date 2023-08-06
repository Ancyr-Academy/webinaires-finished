import { Entity } from '../../shared/entity';

type UserData = {
  id: string;
  emailAddress: string;
  password: string;
};

export class UserEntity extends Entity<UserData> {}
