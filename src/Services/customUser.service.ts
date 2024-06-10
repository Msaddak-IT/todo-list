import {HttpErrors} from '@loopback/rest';
//import {CredentialsRequestBody} from '../controllers';
import {inject} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  Creden,
  UserProfile,
  securityId,
} from '../Interfaces/userServiceInterface';
//import {PasswordHasherBindings} from '../keys';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import jwt from 'jsonwebtoken';
import {promisify} from 'util';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {PasswordHasher} from './hash.password.bcryptjs.service';

// type Creden ={
//   // id:number
//   email:string
//   password:string
//   // firstName:string
//   // lastName:string
// }
export class CustomUserService {
  private readonly DEFAULT_ONE_HOUR_IN_SECONDS = 3600;
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    // @inject(PasswordHasherBindings.PASSWORD_HASHER)
    // public passwordHasher: PasswordHasher,
    @inject('services.BcryptHasher')
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,

  ) { }

  async verifyCredentials(credentials: Creden): Promise<User> {
    console.log('success');
    const {email, password} = credentials;
    console.log(email, password);
    const invalidCredentialsError = 'Invalid credentials (email or password)'
    //const userNotFound = 'the user provided is not found'
    const passwordIncorrect = 'the password seems to be incorrect'
    //the following if statement tells that wether email not found
    if (!email) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const userExist = await this.userRepository.findOne({
      where: {email}
    });
    console.log(userExist);
    //testing whether the user exists by comparing the ones in the
    //params by the ones in the DB ?
    if (!userExist) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError)
    }
    // //verification of existance of the user.
    // const credentialsExist = await this.userRepository.findCredentials(
    //   userExist.id
    // );
    // console.log(credentialsExist);
    // if (!credentialsExist) {
    //   throw new HttpErrors.Unauthorized(userNotFound)
    // }
    //verfication of existance of password
    const passwordMatch = await this.passwordHasher.comparePassword(
      password,
      userExist.password

    )
    console.log(passwordMatch);
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized(passwordIncorrect)
    }
    return userExist

  }
  async convertToUserProfile(user: User): Promise<UserProfile> {

    return {
      [securityId]: user.id,
      firstname: user.firstName,
      id: user.id,
      email: user.email
    };
  }
  async generateTokenWithLifetime(userProfile: UserProfile): Promise<string> {
    const signAsync = promisify<UserProfile, string, jwt.SignOptions, string>(jwt.sign);
    const token = await signAsync(userProfile, this.jwtSecret, {
      expiresIn: this.DEFAULT_ONE_HOUR_IN_SECONDS
    });
    return token
  }
  async addCoinsToUser(userEmail: string, coins: number): Promise<User | null> {
    const filter = {where: {email: userEmail}};
    const user: User | null = await this.userRepository.findOne(filter);
    if (user) {
      user.wallet = +coins
      return user;
    } else {
      throw new Error("user not found")
    }
  }
}

