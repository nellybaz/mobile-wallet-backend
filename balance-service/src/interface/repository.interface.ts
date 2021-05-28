export interface Repository{
  has:(userId:string)=>Promise<boolean>,
  get:(userId:string) => Promise<number>,
  put:(userId:string, amount:number)=>Promise<boolean>
}