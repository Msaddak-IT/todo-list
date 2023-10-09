// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {TokenService, UserService} from '@loopback/authentication';
import {BindingKey} from '@loopback/context';
import {Creden} from './Interfaces/userServiceInterface';
import {PasswordHasher} from './Services/hash.password.bcryptjs.service';
import {User} from './models';

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher');
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindingss {
  export const USER_SERVICE = BindingKey.create<UserService<User, Creden>>(
    'services.user.service',
  );

  //azlekaz
  export namespace TokenServiceBind {
    export const TOKEN_SECRET = BindingKey.create<string>(
      'authentication.jwt.secret',
    );
    export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
      'authentication.jwt.expires.in.seconds',
    );
    export const TOKEN_SERVICE = BindingKey.create<TokenService>(
      'services.authentication.jwt.tokenservice',
    );
  }
  export namespace TokenServiceConstants {
    export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
    export const TOKEN_EXPIRES_IN_VALUE = '600';
  }
}
