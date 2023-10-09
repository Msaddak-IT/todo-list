
// import {type} from 'os';


export declare const securityId: unique symbol;
export type Creden = {
  // id:number
  email: string
  password: string
  // firstName:string
  // lastName:string
}
export interface Principal {
  [securityId]: string;
}
export interface UserProfile extends Principal {
  id: string
  email: string
  firstname: string
}
export interface UserServiceInterface<User> {
  verifyCredentials(credentials: Creden): Promise<User>;
  convertToUserProfile(user: User): Promise<UserProfile>;
 generateTokenWithLifetime(userProfile: UserProfile): Promise<string>;
}

