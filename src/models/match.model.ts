import {Entity, model, property, hasMany} from '@loopback/repository';
import {Bet} from './bet.model';

@model({settings: {strict: false}})
export class Match extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  matchId?: string;

  @property({
    type: 'number'
  })
  idSelected: number

  @property({
    type: 'date',
    required: true,
  })
  matchDateTime: Date;

  @property({
    type: 'string',
    required: true,
  })
  team1: string;

  @property({
    type: 'string',
  })
  team2: string;

  @property({
    type: 'number',
  })
  scoreTeam1: number;

  @property({
    type: 'number',
  })
  scoreTeam2: number;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'boolean'
  })
  selected?: true

  @property({
    type: 'Date'
  })
  startsAt: Date

  @property({
    type:'boolean',
    default:false
  })
  hasEnded:boolean


  @hasMany(() => Bet)
  bets: Bet[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Match>) {
    super(data);
  }
}

export interface MatchRelations {
  // describe navigational properties here
}

export type MatchWithRelations = Match & MatchRelations;
