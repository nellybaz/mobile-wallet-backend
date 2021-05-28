import { expect } from 'chai';
import 'mocha'
import { BalanceService } from '../index';
import { User, Repository } from '../interface'

describe('Balance service', () => {
  let repo: Repository;
  beforeEach(() => {
    repo = { get: () => Promise.resolve(0), has: () => Promise.resolve(true), put: () => Promise.resolve(false) };
  });
  describe('Balance', () => {
    it('returns 0 for user with no balance', async () => {
      let user: User = {
        id: '123'
      }
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(0);
    })

    it('returns zero if user ID is not in the balance DB', async () => {
      let user: User = {
        id: '123'
      }
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(0);
    })

    it('returns correct balance from DB', async () => {
      let user: User = {
        id: '123'
      }
      repo.get = () => Promise.resolve(100);
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(100);
    })
  })

  describe('Credit', () => {

    it('adds to user balance correctly', async () => {
      let user: User = {
        id: '123'
      }
      repo.get = () => Promise.resolve(100);
      repo.put = () => Promise.resolve(true);
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(100);
      expect(await balanceService.credit(user, 100)).to.eq(200);
    })

    it('throws error when cannot credit balance', async () => {
      let user: User = {
        id: '123'
      }
      repo.get = () => Promise.resolve(100);
      repo.put = () => Promise.resolve(false);
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(100);
      try {
        const response = await balanceService.credit(user, 100)
        expect(response).to.eq(0);
      } catch (error) {
        expect(error.message).to.eq("Error crediting balance")
      }
    })
  })

  describe('Debit', () => {

    it('subtracts from user balance correctly', async () => {
      let user: User = {
        id: '123'
      }
      repo.get = () => Promise.resolve(100);
      repo.put = () => Promise.resolve(true);
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(100);
      expect(await balanceService.debit(user, 100)).to.eq(0);
    })

    it('throws error when cannot debit from balance', async () => {
      let user: User = {
        id: '123'
      }
      repo.get = () => Promise.resolve(100);
      repo.put = () => Promise.resolve(false);
      let balanceService = new BalanceService(repo);

      expect(await balanceService.balance(user)).to.eq(100);
      try {
        const response = await balanceService.debit(user, 100)
        expect(response).to.eq(200);
      } catch (error) {
        expect(error.message).to.eq("Error debiting balance")
      }
    })
  })
})