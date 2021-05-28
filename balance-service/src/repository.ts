import { Repository as IRepository } from './interface'
import mongoose, { Mongoose } from 'mongoose';
const Schema = mongoose.Schema;
import { ObjectID } from 'mongodb';


const BalanceSchema = new Schema({
  // id: ObjectID,
  balance: Number,
  updatedAt: Date,
});

const DB_URL = "mongodb+srv://test_user:Bu7QipYYlgrQi2H8@cluster0.zk8pi.mongodb.net/main?retryWrites=true&w=majority";

export class Repository implements IRepository {
  dbUrl: string;

  constructor(dataSourceUrl = DB_URL) {
    this.dbUrl = dataSourceUrl

  }

  async has(userId: string) {
    try {
      this.mongooseInstance()
      const response = this.model().findOne({ _id: new ObjectID(userId) })
      if (response) return true
    } catch (_) { }
    return false;
  }

  async get(userId: string) {
    try {
      this.mongooseInstance()
      const record = await this.model().findOne({_id:userId});
      if(record) return record.balance;
      return 0
    } catch (_) {
    }
    return 0;
  }

  async put(userId: string, amount: number) {
    try {
      this.mongooseInstance()
      const model = this.model()
      const options = {upsert:true}
      const updateRecord = await model.updateOne({ _id: userId }, { balance: amount, updatedAt: new Date() }, options)
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

  async close(mongooseInstance: any) {
    await mongooseInstance.close();
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