import { Observable } from 'rxjs';
import { UserDto } from '../../Model/DtoRec/UserDto';

export interface User {
  name: string;
  picture: string;
}

export interface Contacts {
  user: User;
  type: string;
}

export interface RecentUsers extends Contacts {
  time: number;
}

export abstract class UserData {
  /**
   * 获取当前用户
   */
  abstract getCurrentUser(): Observable<UserDto>;
  abstract getUsers(): Observable<User[]>;
  abstract getContacts(): Observable<Contacts[]>;
  abstract getRecentUsers(): Observable<RecentUsers[]>;
}
