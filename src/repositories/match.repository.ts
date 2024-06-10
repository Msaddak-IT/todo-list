import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import axios from 'axios';
import fs from 'fs';
import {DbDataSource} from '../datasources';
import {Bet, Match, MatchRelations} from '../models';
import {BetRepository} from './bet.repository';

export class MatchRepository extends DefaultCrudRepository<
  Match,
  typeof Match.prototype.id,
  MatchRelations
> {

  public readonly bets: HasManyRepositoryFactory<Bet, typeof Match.prototype.matchId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('BetRepository') protected betRepositoryGetter: Getter<BetRepository>,

  ) {
    super(Match, dataSource);
    this.bets = this.createHasManyRepositoryFactoryFor('bets', betRepositoryGetter,);
    this.registerInclusionResolver('bets', this.bets.inclusionResolver);

  }
  // async getMatchesByLeagueIdOrderedByDate(leagueId: number): Promise<Match[]> {
  //   const currentDate = new Date()
  //   const response = await axios.get(
  //     'https://www.openligadb.de/api/getmatchdata/${leagueId}/${currentDate}'
  //   );
  //   const matches: Match[] = response.data;
  //   matches.sort((a: Match, b: Match) => new Date(a.MatchDateTime).getTime() - (new Date(b.MatchDateTime).getTime()));
  //   return matches
  // }
  async getAllMatchesByDate(selectedDate: Date): Promise<Match[]> {
    const startOfDay: Date = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(selectedDate.setHours(23, 59, 59, 59))
    const matchesList: Match[] = await this.find({

      where: {
        and: [
          {matchDateTime: {gte: startOfDay}},
          {matchDateTime: {lte: endOfDay}}
        ]
      },
    })
    if (matchesList.length == 0) {
      console.log("this list is empty, no matches to retrive ");
    }
    return matchesList;
  }
  async createMatchJson() {
    const date = new Date().toISOString().slice(0, 10);
    const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}.json`;

    try {
      const responseFromAPI = await axios.get('https://soccerway-feed.p.rapidapi.com/v1/matches/list', {
        params: {
          date,
          add_live: 'true',
        },
        headers: {
          'X-RapidAPI-Key': '8aaa2c8a3cmsh2a628749c76e193p15a7a1jsncdb3f3501ef8',
          'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
        },
      });

      fs.writeFile(fileName, JSON.stringify(responseFromAPI.data), (err) => {
        if (err) throw err;
        console.log(`The response has been saved to ${fileName}`);
      });
    } catch (error) {
      console.error(error);
    }
  }

}
