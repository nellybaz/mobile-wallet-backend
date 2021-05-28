import { expect } from 'chai';
import 'mocha'
import { Repository } from '../repository';
import {ObjectId} from 'mongodb'
const userId = '60b0c537913d7372b499a4ff'

describe('Repository', ()=>{
  it('connects successfully to correct datasource url', async () =>{
    try {
      const response = await new Repository().mongooseInstance()
      expect(1).to.eq(1)
    } catch (error) {
      expect(1).to.eq(2)
    }
  })


  it('throws error when connecting to wrong db datasouruce', async () =>{
    try {
      const response = await new Repository('url').mongooseInstance()
      expect(1).to.eq(2)
    } catch (error) {
      expect(error.message).to.eq('Error connecting to repository datasource')
    }
  }).timeout(20000)


  it('returns correct boolean for record in db', async ()=>{
    const repo = new Repository()
    // const response = await repo.mongooseInstance()
    expect(await repo.hasRecord(userId)).to.eq(true)
    expect(await repo.hasRecord('001')).to.eq(false)
  })


  it('returns correct values when putting record to the db', async ()=>{
    const repo = new Repository()
    // const response = await repo.mongooseInstance()
    expect(await repo.putRecord('111', 1000)).to.eq(false)
    expect(await repo.putRecord(new ObjectId().toHexString(), 1000)).to.eq(true)
  })

  it('returns correct balance for record ids', async ()=>{
    const repo = new Repository()
    // const response = await repo.mongooseInstance()
    expect(await repo.getRecord('111')).to.eq(0)
    expect(await repo.getRecord(new ObjectId().toHexString())).to.eq(0)
    expect(await repo.getRecord(userId)).to.eq(1000)
  })
})