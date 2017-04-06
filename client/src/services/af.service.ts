import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { UserAmount } from '../models/userAmount.model';
@Injectable()
export class AfService {
    private  groups:FirebaseListObservable<Group[]>;
    private allUsers:FirebaseListObservable<UserAmount[]>;
    private userInfo:FirebaseListObservable<any>;
    private groupname:string;
    private firstTime:boolean = false;
    constructor(private _af:AngularFire) {
    this.getGroups();
    //this.getSetUsers();
   }

public createUser(username, groupname){
  this.userInfo = this._af.database.list('/userTotals/'+username) as FirebaseListObservable<any>;
  //console.log(this.allUsers)

}

  getSetUsers(groupname:string = ''){
   if(groupname !=''){
      this.allUsers = this._af.database.list('/userTotals', {
      query: {
          orderByChild: 'groupname',
          equalTo: groupname
        }
      }) as FirebaseListObservable<UserAmount[]>;
     //console.log(this.allUsers)
   }else{
     this.allUsers = this._af.database.list('/userTotals/', {preserveSnapshot: true}) as FirebaseListObservable<UserAmount[]>;
  }
     return this.allUsers;
}

  getGroups(){
    this.groups = this._af.database.list('/groups') as
    FirebaseListObservable<Group[]>;
    return this.groups;
  }

  updateUserAmount(user){

    this.userInfo.remove().then(
    (snapshot)=>{
      console.log(user);
      return this.userInfo.push(user)
    }
  )
  //return this.allUsers.push(user)
  }

  /*updateUserAmounts(groupname:string, users:UserAmount[]){
    this.allUsers.push(users)

    return this.allUsers;
  }*/

  setGroup(group:Group){
    //console.log(this.groups)
  return this.groups.push(group);
  }
}
