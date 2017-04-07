import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { UserAmount } from '../models/userAmount.model';
@Injectable()
export class AfService {
    private  groups:FirebaseObjectObservable<Group[]>;
    private allUsers:FirebaseListObservable<UserAmount[]>;
    private userInfo:FirebaseListObservable<any>;
    private user:FirebaseObjectObservable<any>;

    constructor(private _af:AngularFire) {
    this.getGroups();
    //this.getSetUsers();
   }

public createUser(username, groupname){
return this.userInfo = this._af.database.list('/userTotals/'+username) as FirebaseListObservable<any>;

}

getUsers(groupname:string){
  return this.allUsers = this._af.database.list('/userTotals/'+groupname) as FirebaseListObservable<any>;
}

public getUser(username:string = '', groupname:string){
  return this.user = this._af.database.object('/userTotals/'+groupname+"/"+username, {preserveSnapshot: true}) as FirebaseObjectObservable<any>;
}

public getGroups(){
  return this.groups = this._af.database.object('/groups') as FirebaseObjectObservable<Group[]>;

}
//This is called in group service, when socket is emitted
public updateUserAmount(user){
  this.user.remove().then(
    ()=>{
      console.log(user);
      return  this.user.set(user)
    })
}
public setGroup(group:Group, groupname:string){
  return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).set(group);
  }
}
