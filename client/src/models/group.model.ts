export class Group {
  constructor(public groupname: string,
              public admin: string,
              public totalBillAmount: number,
              public address: any,
              public completed: boolean,
              public groupcode:number,
              public groupmembers:Array<any>){}

}
