import {Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class Userhistory extends User {
  @property({
    type: 'object',
    required: true,
    default:''
  })
  description: {
    fr:string
    en:string};

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  idHistory?: string;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(new Date().getTime())
  })
  createdAt:Date;


  constructor(data?: Partial<Userhistory>) {
    super(data);
  }
}

export interface UserhistoryRelations {
  // describe navigational properties here
}

export type UserhistoryWithRelations = Userhistory & UserhistoryRelations;
