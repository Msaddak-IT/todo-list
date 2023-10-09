// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-todo-jwt
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TokenService} from '@loopback/authentication';
import {
  //MyUserService,
  TokenServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {
  HttpErrors,
  // getModelSchemaRef,
  post,
  requestBody,
  SchemaObject
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
//import {promisify} from 'util';
import {Creden, securityId, UserProfile} from '../Interfaces/userServiceInterface';
//import {UserServiceBindingss} from '../keys';
import {authenticate} from '@loopback/authentication';
import {get} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {CustomUserService} from '../Services/customUser.service';


interface SignUpResponse {
  email: string;
  firstName?: string;
  lastName?: string;
  //token: string;
}

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
//what is needed for sign up.
const CredentialsSchemaSignUp: SchemaObject = {
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    firstName: {
      type: 'string',
      minLength: 2,
    },
    lastName: {
      type: 'string',
      minLength: 2,
    }
  },
};

const CredentialsSchemaLogin: SchemaObject = {
  type: 'object',
  //required: ['email', 'password', 'firstName', 'lastName'],
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  }
}
export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchemaLogin},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    // @inject(UserServiceBindingss.USER_SERVICE)
    // public customUserService: CustomUserService,
    @inject('services.CustomUserService')
    public customUserService: CustomUserService,

    // @inject(UserServiceBindingss.USER_SERVICE)
    // public userService: CustomUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Creden,
  ): Promise<{token: string}> {
    // Verifying credentials.
    console.log(credentials);
    const user = await this.customUserService.verifyCredentials(credentials);


    // convert a User object into a UserProfile object (reduced set of properties)
    const customUserProfile = await this.customUserService.convertToUserProfile(user)

    // create a JSON Web Token based on the user profile
    const token = await this.customUserService.generateTokenWithLifetime(customUserProfile);
    return {token};
    //   const token = await this.generateTokenWithLifetime(userProfile, 8 * 60 * 60); // 8 hours lifetime
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  //new signup method
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: CredentialsSchemaSignUp,
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<SignUpResponse | Error> {
    const {password, ...rest} = newUserRequest

    const userExist = await this.userRepository.findOne({where: {email: rest.email}})
    if (userExist) return HttpErrors.BadRequest("email alredy exist")
    else {
      const hashPassword = await hash(password, await genSalt());
      const newUser = await this.userRepository.create({...rest, password: hashPassword})
      return newUser
    }
  }
}
  // async signUp(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: CredentialsSchemaSignUp, // Use the credentials schema for validation
  //       },
  //     },
  //   })
  //   newUserRequest: NewUserRequest,
  // ): Promise<SignUpResponse> {
  //   const password = await hash(newUserRequest.password, await genSalt());
  //   const savedUser = await this.userRepository.create(
  //     _.omit(newUserRequest, 'password'),
  //   );
  //   const user = await this.userService.verifyCredentials(newUserRequest);
  //   const userProfile = this.userService.convertToUserProfile(user);
  //   const token = await this.generateTokenWithLifetime(userProfile, 8 * 60 * 60); // 8 hours lifetime

  //   return {
  //     email: savedUser.email,
  //     firstName: savedUser.firstName,
  //     lastName: savedUser.lastName,
  //     token,
  //   };
  // }



//   // Method to generate a token with a specific lifetime
//   private async generateTokenWithLifetime(userProfile: UserProfile, lifetimeInSeconds: number): Promise<string> {
//     const signAsync = promisify<UserProfile, string, jwt.SignOptions, string>(jwt.sign);
//     const token = await signAsync(userProfile, 'HS256', {
//       expiresIn: lifetimeInSeconds,
//     });
//     return token;
//   }
// }
