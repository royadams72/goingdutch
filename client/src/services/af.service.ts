import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { UserAmount } from '../models/userAmount.model';
//import { HaversineService, GeoCoord} from "ng2-haversine";
@Injectable()
export class AfService {
    private  groups:FirebaseListObservable<Group[]>;
    private  group:FirebaseObjectObservable<Group>;
    private allUsers:FirebaseListObservable<UserAmount[]>;
    private userInfo:FirebaseObjectObservable<any>;
    private user:FirebaseObjectObservable<any>;

    constructor(private _af:AngularFire) {
  //  this.getGroups(false);
    //this.getSetUsers();
   }
public login(){
    this._af.auth.login();
}



public getInfo(){
 return this._af.auth.subscribe(user => {
   if(!user){
       console.log("No user")
       this.login();
       return;
       }
      // console.log(user)
 });// user info is inside auth object
}


getOldAmounts(groupname:string){
  return this.allUsers = this._af.database.list('/userTotals/'+groupname) as FirebaseListObservable<any>;
}
  public getUser(username:string, groupname:string){
    let user = this._af.database.object('/userTotals/'+groupname+"/"+username) as FirebaseObjectObservable<any>
  //  console.log(user)
    return user;
  }

  public getGroups(bool, username){

     let  groups = (this._af.database.list('/groups', {query: {
          orderByChild: 'completed',
          equalTo: bool,

        }})as FirebaseListObservable<any>)
        return groups
      }

  public updateGroupmembers(groupname, arr){
    return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({groupmembers: arr});
      }

  public setGroupComplete(groupname:string, toggle:boolean){
    (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({ completed: toggle });
    }


//This is called in group service, when socket is emitted
  public updateUserAmount(user, username, groupname){
      return  (this._af.database.object('/userTotals/'+groupname+"/"+username) as FirebaseObjectObservable<any>).update(user);
  }
  public setGroup(group:Group, groupname:string){
    return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).set(group);
    }

  public checkifInGroup(groupname){
    return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<any>);
  }

  public deleteReceipt(groupname){
    (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).remove();
    (this._af.database.object('/userTotals/'+groupname) as FirebaseObjectObservable<Group>).remove();
  }

}
