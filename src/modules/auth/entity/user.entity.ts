import { AbstractEntity } from '../../shared/entity';

type UserData = {
  id: string;
  emailAddress: string;
  password: string;
};

export class UserEntity extends AbstractEntity<UserData> {}
