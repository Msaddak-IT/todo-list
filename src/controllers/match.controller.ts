import {
  repository
} from '@loopback/repository';
import {
  get,
  post,
  response
} from '@loopback/rest';
import fs from 'fs';
import moment from 'moment';
import {Match} from '../models';
import {MatchRepository} from '../repositories';

export class MatchController {
  constructor(
    @repository(MatchRepository)
    private matchRepository: MatchRepository,
  ) { }

  @post('/postAllTodayMatchesFromApiResponse')
  async parseAndGetAllMatches(): Promise<void> {
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}` + `result.json`;
    // Reading the current file
    const dataFromAPI = fs.readFileSync(fileName, 'utf8');
    const parserJSON = JSON.parse(dataFromAPI);
    let matches: any = [];
    // Extract all matches from each competition
    parserJSON.data.forEach((dataItem: any) => {
      dataItem.competitions.forEach((competition: any) => {
        competition.matches.forEach((match: any) => {
          //creation of only the hour and the minutes in the startsAt attribute in match
          let isoDate = moment(match.date_time_utc)
          let startTime = isoDate.format("HH:mm")
          // Create a Match instance from the match data
          let newMatch = new Match({
            idSelected: match.id,
            matchDateTime: new Date(match.date_time_utc),
            team1: match.team_A.name,
            team2: match.team_B.name,
            location: dataItem.name,
            startsAt: startTime,
          });
          matches.push(newMatch);

        });
      });
    });
    await this.matchRepository.createAll(matches);
    console.log("matches have been pushed to the database successfully !!! ");
  }


  @get('/match')
  @response(200, {
    description: 'Match model count',
  })
  async resultOfComparison(): Promise<void> {
    const date: Date = new Date();
    const utcDate: String = moment.utc().format().toString();
    console.log(date);
    console.log(utcDate);
    const matchDateTime: String = "2023-10-27T15:43:00.000+00:00"
    console.log(date.toISOString() > matchDateTime);
  }



  @get('/getTodayMatchesResults')
  @response(204, {
    description: 'All matches results'
  })
  async getAllMatchesResults(): Promise<Match[]> {
    const date = new Date().toISOString().slice(0, 10);
    const dateDate: Date = new Date();
    const dateISOString = new Date().toISOString().slice(0, 10);

    const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}` + `result.json`;
    // Reading the current file
    const dataFromAPI = fs.readFileSync(fileName, 'utf8');
    const parserJSON = JSON.parse(dataFromAPI);
    let matches: Match[] = await this.matchRepository.getAllMatchesByDate(dateDate);
    // Extract all matches from each competition
    parserJSON.data.forEach((dataItem: any) => {
      dataItem.competitions.forEach((competition: any) => {
        competition.matches.forEach((matchFromAPI: any) => {
          //console.log(matchFromAPI);
          matches.forEach(async (dbMatch: Match) => {
            if (dbMatch.idSelected == matchFromAPI.id && matchFromAPI.status == "Played") {//
              dbMatch.scoreTeam1 = matchFromAPI.fts_A;
              dbMatch.scoreTeam2 = matchFromAPI.fts_B;
              dbMatch.hasEnded = true;
              await this.matchRepository.update(dbMatch);
            }
          });
        });
      });
    });
    console.log("All matches' scores have been updated");
    return matches;
  }

  @get('/getAllMatchesToday')
  @response(200, {
    description: "all matches by date",

  })
  async getAllByDate(): Promise<void> {
    const date: Date = new Date();
    const matches: Match[] = await this.matchRepository.getAllMatchesByDate(date);
    console.log(matches);

  }


  @post('/PostMatchesByPinging')
  async PostMatchesByPinging() {
    const date = new Date().toISOString().slice(0, 10);
    await this.matchRepository.createMatchJson();
    const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}.json`;

    //adding to the database:
    const dataFromAPI = fs.readFileSync(fileName, 'utf8');
    const parserJSON = JSON.parse(dataFromAPI);
    let matches: any = [];
    // Extract all matches from each competition
    parserJSON.data.forEach((dataItem: any) => {
      dataItem.competitions.forEach((competition: any) => {
        competition.matches.forEach((match: any) => {
          //creation of only the hour and the minutes in the startsAt attribute in match
          let isoDate = moment(match.date_time_utc)
          let startTime = isoDate.format("HH:mm")
          // Create a Match instance from the match data
          let newMatch = new Match({
            idSelected: match.id,
            matchDateTime: new Date(match.date_time_utc),
            team1: match.team_A.name,
            team2: match.team_B.name,
            location: dataItem.name,
            startsAt: startTime,
          });
          matches.push(newMatch);

        });
      });
    });
    await this.matchRepository.createAll(matches);
    console.log("matches have been pushed to the database successfully !!! ");
  }
  @get('/getAllMatches')
  async getAllMatchesFromDatabase(): Promise<Match[]> {
    return this.matchRepository.find()
  }
}




//   if (Array.isArray(matchesDataAPI)) {
//     for (const matchAPI of matchesDataAPI) {
//       const match = new Match();
//       match.idSelected = matchAPI.id;
//       match.matchDateTime = new Date(matchAPI.date_time_utc);
//       match.team1 = matchAPI.team_A.name;
//       match.team2 = matchAPI.team_B.name;

//       if (matchAPI.status === "Fixture") {
//         match.hasEnded = false;
//       } else if (matchAPI.status === "Playing") {
//         match.hasEnded = false;
//         match.scoreTeam1 = matchAPI.fts_A;
//         match.scoreTeam2 = matchAPI.fts_B;
//       } else if (matchAPI.status === "Played") {
//         match.hasEnded = true;
//         match.scoreTeam1 = matchAPI.fts_A;
//         match.scoreTeam2 = matchAPI.fts_B;
//       }

//       await this.matchRepository.create(match);
//     }
//   } else {
//     throw new HttpErrors.BadRequest('Invalid JSON format or the JSON is empty');
//   }
// } catch (error) {
//   throw new HttpErrors.InternalServerError('Error parsing and creating matches: ' + error.message);
// }
//
/*
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
        'X-RapidAPI-Key': '8aaa2c8a3cmsh2a628749c76e193p15a7a1jsncdb3f3501ef8',
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
    @param.query.string('selectedIds') selectedIds: string[]
  )
    : Promise<Match[] | void> {
    const ERROR_MATCHES_NOT_FOUND = 'error matches not found'
    const perPage = 15;
    const page = 1;
    const selectedMatches: Match[] = [];
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const options = {
          method: 'GET',
          url: 'https://soccerway-feed.p.rapidapi.com/v1/matches/list',
          params: {
            date,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            add_live: 'true',
            page,
            size: perPage,
          },
          headers: {
            'X-RapidAPI-Key': '8aaa2c8a3cmsh2a628749c76e193p15a7a1jsncdb3f3501ef8',
            'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
          }
        }
        const responseFromAPI = await axios.request(options)
        const matchesFromResponse = responseFromAPI.data?.matches || []
        if (matchesFromResponse.length === 0) {
          console.log("no matches in response");
          break;
        }
        const filteredMatches = matchesFromResponse.filter((match: Match) =>
          match.id !== undefined && selectedIds.includes(match.id));
      }

    } catch (error) {
      console.error(ERROR_MATCHES_NOT_FOUND)
    }
    const savedMatches: Match[] = [];
    for (const match of selectedMatches) {
      const newMatch = new Match()
      newMatch.matchDateTime = new Date(match.matchDateTime)
      newMatch.team1 = match.team1;
      newMatch.team2 = match.team2;
      newMatch.scoreTeam1 = match.scoreTeam1
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
*/
//}
