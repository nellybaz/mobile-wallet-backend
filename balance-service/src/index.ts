import { User, Repository } from './interface/'

export class BalanceService {
  repository;
  constructor(repository: Repository) {
    this.repository = repository;
  }

  async balance(user: User): Promise<number> {
    if (await !this.repository.has(user.id)) {
      return 0;
    }
    return this.repository.get(user.id);
  }

  async credit(user: User, amount: number): Promise<number> {
    let currentAmount = await this.repository.get(user.id);
    let newAmount = currentAmount + amount;
    let creditRes = await this.repository.put(user.id, newAmount);
    if (creditRes) return newAmount;
    throw Error('Error crediting balance')
  }

  async debit(user: User, amount: number): Promise<number> {
    let currentAmount = await this.repository.get(user.id);
    let newAmount = currentAmount - amount;
    let creditRes = await this.repository.put(user.id, newAmount);
    if (creditRes) return newAmount;
    throw Error('Error debiting balance')
  }
}