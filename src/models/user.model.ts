import {Entity, hasMany, model, property} from '@loopback/repository';
import {Todo} from './todo.model';
import {Bet} from './bet.model';

@model({settings: {strict: false, hiddenProperties: ['password']}, })
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;
  @property({
    type: 'string',
    require: true
  })
  password: string

  @property({
    type: 'Date',
    default: () => new Date(new Date().getTime())
  })
  createdAt: Date

  @property({
    type:'number'
  })
  wallet:number


  @hasMany(() => Todo)
  todos: Todo[];

  @hasMany(() => Bet)
  bets: Bet[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}


export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
