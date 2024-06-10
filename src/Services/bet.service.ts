import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs';
import {Bet, Match} from '../models';
import {BetRepository, MatchRepository, UserRepository} from '../repositories';
@injectable({scope: BindingScope.TRANSIENT})
export class BetService {
  constructor(
    @repository(BetRepository) private betRepository: BetRepository,
    @repository(MatchRepository) private matchRepository: MatchRepository,
    @repository(UserRepository) private userRepository: UserRepository,
  ) {
    dotenv.config();
  }
  async placeBet(email: string, matchId: string, coins: number, betScoreTeam1: number, betScoreTeam2: number): Promise<Bet> {
    //const filter = {where: {email: userEmail}};
    //const user: User | null = await this.userRepository.findOne(filter);
    const match: Match = await this.matchRepository.findById(matchId);
    const odds: number = await this.betRepository.findTotalCoinsByMatchIdAndBetType(matchId, betScoreTeam1, betScoreTeam2);
    const newBet: Partial<Bet> = {
      //user: user,
      matchId: matchId,
      coins: coins,
      betScoreTeam1: betScoreTeam1,
      betScoreTeam2: betScoreTeam2,
      odds: odds
    }
    return this.betRepository.create(newBet);
  }



  // async placeBet(userId: string, matchId: string, betType: 'Team1' | 'Draw' | 'Team2', coins: number): Promise<Bet> {
  //   //getting the match by the id passed in parameter
  //   const match: Match = await this.matchRepository.findById(matchId);
  //   //getting ths user by his Id
  //   const user: User = await this.userRepository.findById(userId);

  //   const totalBetsOnMatch = await this.betRepository.findTotalcoinsByMatchId(matchId);

  //   const totalCoinsOnMatchAndBetType = await this.betRepository.findTotalCoinsByMatchIdAndBetType(matchId, betType);

  //   const odds: number = totalCoinsOnMatchAndBetType / totalBetsOnMatch;
  //   //new Date() generates the local system time as utc time
  //   const systemDate: Date = new Date();
  //   //converting the utc system time to the iso String so it wil lcomparable with the dateand time in the json file
  //   const currentDateISO: String = systemDate.toISOString();

  //   if (odds < 1.01) {
  //     throw new Error("odds are below 1.01 ")
  //   }
  //   if (user.wallet < coins) {
  //     throw new Error("you don't have enough coins");
  //   } else
  //     if (match.matchDateTime.toString() < currentDateISO) {
  //       throw new Error('the match has already started no bets are allowed')
  //     }
  //   const bet = new Bet({
  //     user: user,
  //     matchId: matchId,
  //     betType: betType,
  //     coins: coins,
  //     odds: odds,
  //     oddOpen: true
  //   })

  //   return this.betRepository.create(bet)
  // }

  // // if won or lost
  // async isWinner(bet: Bet, matchId: string): Promise<Boolean> {
  //   const match: Match = await this.matchRepository.findById(bet.matchId);
  //   if (bet.betType === "Team1" && match.scoreTeam1 > match.scoreTeam2 && match.hasEnded === true) {
  //     return true
  //   } else if (bet.betType === "Team2" && match.scoreTeam1 < match.scoreTeam2 && match.hasEnded === true) {
  //     return true
  //   } else if (bet.betType === "Draw" && match.scoreTeam1 === match.scoreTeam2 && match.hasEnded === true) {
  //     bet.user
  //     return true
  //   } else {return false}
  // }
  // // async rewardWinners(bet: Bet, matchId: string): Promise<void> {
  // //   //search for the winners by match Id.
  // //   const bets: Bet[] = await this.betRepository.find({
  // //     where: {
  // //       matchId: matchId,
  // //     }
  // //   });
  // //   for (const bet of bets) {
  // //     const isBetWinner: Boolean = await this.isWinner(bet, matchId);
  // //     if (isBetWinner) {
  // //       //calculating the winnings for each bet won, isWinner return true
  // //       //every won bet with the comission of the business
  // //       const comission: number = parseFloat(process.env.COMMISSION_RATE || '0')
  // //       const winnings: number = bet.coins * bet.odds * (1 - comission)
  // //       bet.user.wallet += winnings
  // //       //updating the user Model and updating also the history and the
  // //       // user history, which extends the user and
  // //       await this.userRepository.update(bet.user)

  // //       bet.oddOpen = false
  // //       //updating the bet model so it won't accept any more odds.
  // //       await this.betRepository.update(bet);
  // //     }
  // //   }
  // // }
  // async rewardWinners():Promise<void>{

  // }
  
}


