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
  response,
} from '@loopback/rest';
import axios from 'axios';
import {Match} from '../models';
import {MatchRepository} from '../repositories';
export class MatchController {
  constructor(
    @repository(MatchRepository)
    private matchRepository: MatchRepository,
  ) { }

  @post('/matches')
  @response(200, {
    description: 'Match model instance',
    content: {'application/json': {schema: getModelSchemaRef(Match)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {
            title: 'NewMatch',
            exclude: ['id'],
          }),
        },
      },
    })
    match: Omit<Match, 'id'>,
  ): Promise<Match> {
    return this.matchRepository.create(match);
  }

  @get('/matches/count')
  @response(200, {
    description: 'Match model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Match) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchRepository.count(where);
  }

  @get('/matches')
  @response(200, {
    description: 'Array of Match model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Match, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Match) filter?: Filter<Match>,
  ): Promise<Match[]> {
    return this.matchRepository.find(filter);
  }

  @patch('/matches')
  @response(200, {
    description: 'Match PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
    @param.where(Match) where?: Where<Match>,
  ): Promise<Count> {
    return this.matchRepository.updateAll(match, where);
  }

  @get('/matches/{id}')
  @response(200, {
    description: 'Match model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Match, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Match, {exclude: 'where'}) filter?: FilterExcludingWhere<Match>
  ): Promise<Match> {
    return this.matchRepository.findById(id, filter);
  }

  @patch('/matches/{id}')
  @response(204, {
    description: 'Match PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Match, {partial: true}),
        },
      },
    })
    match: Match,
  ): Promise<void> {
    await this.matchRepository.updateById(id, match);
  }

  @put('/matches/{id}')
  @response(204, {
    description: 'Match PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() match: Match,
  ): Promise<void> {
    await this.matchRepository.replaceById(id, match);
  }

  @del('/matches/{id}')
  @response(204, {
    description: 'Match DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.matchRepository.deleteById(id);
  }



  @get('/matchesByDate')
  //form of data must be as the following: YYYY-MM-DD (expl: 2023-08-14)
  async getSoccerMatchesByDate(
    @param.query.string('date') date: string): Promise<object | void> {
    const options = {
      method: 'GET',
      url: 'https://soccerway-feed.p.rapidapi.com/v1/matches/list',
      params: {
        date,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        add_live: 'true',
      },
      headers: {
        'X-RapidAPI-Key': 'a860e986b5mshffe1382d7662ce7p1129fajsn413e51a8b0a2',
        'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
      },
    }
    try {
      const responseFromAPI = await axios.request(options)
      return responseFromAPI.data
    } catch (error) {
      console.error(error)
    }
  }


  @get('/matches/selectedMatches')
async getSelected(
  @param.query.string('date') date: string,
  @param.query.string('selectedIds') selectedIds:string[]
  )
  : Promise<Match[] | void> {
    const ERROR_MATCHES_NOT_FOUND='error matches not found'
    const perPage=15;
    const page=1;
    const selectedMatches:Match[]=[];
    try {
      // eslint-disable-next-line no-constant-condition
      while (true){
        const options={
          method: 'GET',
          url: 'https://soccerway-feed.p.rapidapi.com/v1/matches/list',
          params: {
            date,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            add_live: 'true',
            page,
            size: perPage,
        },
        headers:{
          'X-RapidAPI-Key': 'a860e986b5mshffe1382d7662ce7p1129fajsn413e51a8b0a2',
          'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
        }
      }
      const responseFromAPI=await axios.request(options)
      const matchesFromResponse=responseFromAPI.data?.matches||[]
      if (matchesFromResponse.length === 0){
        console.log("nomatches in response");
        break;
        }
        const filteredMatches = matchesFromResponse.filter((match:Match) =>
          match.id !== undefined && selectedIds.includes(match.id));
      }

        }catch (error) {
        console.error(ERROR_MATCHES_NOT_FOUND)
        }
        const savedMatches:Match[]=[];
        for (const match of selectedMatches){
          const newMatch = new Match()
          newMatch.matchDateTime=new Date(match.matchDateTime)
          newMatch.team1=match.team1;
          newMatch.team2=match.team2;
          newMatch.scoreTeam1=match.scoreTeam1
        }

}


// {
//   UNIQUE_ID_PATTERN,
//   date,
//   {datttz},
//   deleted=true
// }
// }






    // function getDateRange() {
    //   const currentDate = new Date();
    //   const nextThreeDays = [];
    //   for (let i = 0; i < 3; i++) {
    //     const nextDay = new Date(currentDate);
    //     nextDay.setDate(currentDate.getDate() + i);
    //     nextThreeDays.push(formatDate(nextDay));
    //   }
    //   return nextThreeDays.join(',')
    // }
    // //form of date that will be used.
    // // eslint-disable-next-line @typescript-eslint/no-shadow
    // function formatDate(date: Date) {
    //   const year = date.getFullYear();
    //   const month = String(date.getMonth() + 1).padStart(2, '0');
    //   const day = String(date.getDate()).padStart(2, '0')
    //   return `${year}-${month}-${day}`}}
}
