import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {User, Userhistory} from '../models';
import {UserhistoryRepository} from '../repositories';


@injectable({scope: BindingScope.TRANSIENT})
export class UserHistoryService {
  constructor(@repository(UserhistoryRepository) userHistoryRepo: UserhistoryRepository
  ) { }

  async updateWalletOfUserEn(userHisotry: Userhistory, user: User, coins: number): Promise<Userhistory> {
    user.wallet -= coins
    userHisotry.wallet -= coins
    userHisotry.description.en = `${coins} have been withdrawed from your wallet `;
    return userHisotry
  }
  async updateWalletOfUserFr(userHisotry: Userhistory, user: User, coins: number): Promise<Userhistory> {
    user.wallet -= coins
    userHisotry.wallet -= coins
    userHisotry.description.en = `${coins} ont été retirés de votre portefeuille `
    return userHisotry
  }


}
