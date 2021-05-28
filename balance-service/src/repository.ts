import { Repository as IRepository } from './interface'
import mongoose, { Mongoose } from 'mongoose';
const Schema = mongoose.Schema;
import { ObjectId } from 'mongodb';
import dotenv from "dotenv"
dotenv.config()


const BalanceSchema = new Schema({
  balance: Number,
  updatedAt: Date,
});

const DB_URL = process.env['DB_URL']?.toString() || 'url';

export class Repository implements IRepository {
  dbUrl: string;

  constructor(dataSourceUrl = DB_URL) {

    this.dbUrl = dataSourceUrl
  }

  async has(userId: string) {
    try {
      this.mongooseInstance()
      const response = await this.model().findById(new ObjectId(userId));
      await mongoose.connection.close()
      if (response.balance) return true
    } catch (_) { }
    return false;
  }

  async get(userId: string) {
    try {
      this.mongooseInstance()
      const record = await this.model().findOne({ _id: userId });
      await mongoose.connection.close()
      if (record) return record.balance;
      return 0
    } catch (_) {
    }
    return 0;
  }

  async put(userId: string, amount: number) {
    try {
      const connection = this.mongooseInstance()
      const model = this.model()
      const options = { upsert: true }
      const updateRecord = await model.updateOne({ _id: userId }, { balance: amount, updatedAt: new Date() }, options)
      await mongoose.connection.close()
      if (updateRecord) return true
    } catch (error) {

    }
    return false
  }

  async mongooseInstance() {
    try {
      return await mongoose.connect(this.dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
    } catch (error) {
      throw Error('Error connecting to repository datasource');
    }
  }

  model() {
    try {
      return mongoose.model('Balance', BalanceSchema);
    } catch (error) {
      console.log('Error getting model');
      throw Error('Error getting model');
    }
  }
}