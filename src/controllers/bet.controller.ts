import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response
} from '@loopback/rest';
import {Bet} from '../models';
import {BetRepository} from '../repositories';
import {BetService} from '../Services';

export class BetController {
  constructor(
    @repository(BetRepository)
    public betRepository: BetRepository,
    @service(BetService)
    public betService: BetService,
  ) { }

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

          }),
        },
      },
    })
    bet: Bet,
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


  @post('/bets/addBet/')
  @response(200, {
    description: 'Bet Added to the match Successfully! '
  })
  async addBet(@param.query.string('userId') userId: string, @param.query.string('matchId') matchId: string, @param.query.number('coins') coins: number, @param.query.number('betScoreTeam1') betScoreTeam1: number, @param.query.number('betScoreTeam2') betScoreTeam2: number): Promise<void> {
    await this.betService.placeBet(userId, matchId, coins, betScoreTeam1, betScoreTeam2)
  }
  

}
