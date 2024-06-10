import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';

import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';

import {AuthenticationComponent} from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {CronComponent} from '@loopback/cron';
import {BcryptHasher} from './Services';
import {CustomUserService} from './Services/customUser.service';
import {MatchController} from './controllers';
import {DbDataSource} from './datasources';
import {PasswordHasherBindings} from './keys';



export {ApplicationConfig};

export class TodoListApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    //Authentication part:
    //Mount authentication system
    this.component(AuthenticationComponent);
    //jwt component
    this.component(JWTAuthenticationComponent);
    //Datasource binding
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
    // this is the binding of the CronJob which was imported from the @loopabck/cron.
    this.component(CronComponent);


    this.setUpBindings();

    this.controller(MatchController)

  }
  setUpBindings(): void {
    this.bind('service.customUserService').toClass(CustomUserService);
    
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher)
    this.bind(PasswordHasherBindings.ROUNDS).to(10)
  }
}
