import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Bet} from '../models';
import {BetRepository} from '../repositories';
import {service} from '@loopback/core';
import {BetService} from '../Services';
import {request} from 'http';
import {json} from 'stream/consumers';

export class BetController {
  constructor(
    @repository(BetRepository)
    public betRepository : BetRepository,
    @service(BetService)
    public betService: BetService,
  ) {}

  @post('/bets')
  @response(200, {
    description: 'Bet model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bet)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {
            title: 'NewBet',
            exclude: ['id'],
          }),
        },
      },
    })
    bet: Omit<Bet, 'id'>,
  ): Promise<Bet> {
    return this.betRepository.create(bet);
  }

  @get('/bets/count')
  @response(200, {
    description: 'Bet model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bet) where?: Where<Bet>,
  ): Promise<Count> {
    return this.betRepository.count(where);
  }

  @get('/bets')
  @response(200, {
    description: 'Array of Bet model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bet, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bet) filter?: Filter<Bet>,
  ): Promise<Bet[]> {
    return this.betRepository.find(filter);
  }

  @patch('/bets')
  @response(200, {
    description: 'Bet PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {partial: true}),
        },
      },
    })
    bet: Bet,
    @param.where(Bet) where?: Where<Bet>,
  ): Promise<Count> {
    return this.betRepository.updateAll(bet, where);
  }

  @get('/bets/{id}')
  @response(200, {
    description: 'Bet model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bet, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Bet, {exclude: 'where'}) filter?: FilterExcludingWhere<Bet>
  ): Promise<Bet> {
    return this.betRepository.findById(id, filter);
  }

  @patch('/bets/{id}')
  @response(204, {
    description: 'Bet PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {partial: true}),
        },
      },
    })
    bet: Bet,
  ): Promise<void> {
    await this.betRepository.updateById(id, bet);
  }

  @put('/bets/{id}')
  @response(204, {
    description: 'Bet PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() bet: Bet,
  ): Promise<void> {
    await this.betRepository.replaceById(id, bet);
  }

  @del('/bets/{id}')
  @response(204, {
    description: 'Bet DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.betRepository.deleteById(id);
  }

  @post('/bets/addBet')
  async placeBet(
  @requestBody({
    content:{
      'application/json':{
        schema:{
          type:'object',
          properties:{
            userId:{type:'string'},
            matchId:{type:'string'},
            betType:{type:'string',enum:['Team1', 'Draw','Team2']},
            coins:{type:'number'},
          }
        }
      }
    }
  })
  betData:{userId:string; matchId:string; betType:'Team1'|'Draw'|'Team2';coins:number},
  ):Promise<Bet|Error>{
return this.betService.placeBet(betData.userId,betData.matchId,betData.betType,betData.coins);
  }
}
