export interface Repository{
  hasRecord:(userId:string)=>Promise<boolean>,
  getRecord:(userId:string) => Promise<number>,
  putRecord:(userId:string, amount:number)=>Promise<boolean>
}