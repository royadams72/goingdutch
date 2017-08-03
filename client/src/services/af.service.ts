import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { UserDetails } from '../models/user.interface';
import { UserInfo } from '../models/userAmount.model';
import { Observable } from "rxjs";
//import { HaversineService, GeoCoord} from "ng2-haversine";
@Injectable()
export class AfService {
    private  groups:FirebaseListObservable<Group[]>;
    private  group:FirebaseObjectObservable<Group>;
    private allUsers:FirebaseListObservable<UserInfo[]>;
    private userInfo:FirebaseObjectObservable<any>;
    private user:FirebaseObjectObservable<any>;
    private userInterface:UserDetails;
    constructor(private _af:AngularFire) {
  //  this.getGroups(false);

   }
   public login(){
       this._af.auth.login();
   }
   public getInfo(){
    return this._af.auth.subscribe(user => {
      // console.log(user)
      if(!user){
          console.log("No user")
          this.login();
          return;
          }
         // console.log(user)
    });// user info is inside auth object
   }
    public getUserItems(groupname:string){
      return this.allUsers = this._af.database.list('/userTotals/'+groupname) as FirebaseListObservable<any>;
    }
    public getUser(username:string, groupname:string){
        let user = this._af.database.object('/userTotals/'+groupname+"/"+username) as FirebaseObjectObservable<any>
      //  console.log(user)
        return user;
      }

    public getGroups(bool,username){
      let groups
      let user
      let groupmember;
          return groups = (this._af.database.list('/groups')as FirebaseListObservable<any>)
                .map(group =>{
                    return group.map((obj)=>{
                      if(!bool){
                        // console.log(bool)
                          if(obj.completed === bool){
                              return obj
                          }
                        }else{
                          // console.log(bool)
                          groupmember = obj.groupmembers.find((user)=> user === username)
                              if(groupmember !== undefined && obj.completed === bool){
                                // console.log(obj)
                                return obj
                              }
                        }
                     })
                  })


        }

    public updateGroupmembers(groupname, username){
      let groupArray = [];
      return (this._af.database.list('/groups/'+groupname)as FirebaseListObservable<Group[]>)
              .map((group) =>{
                //Find the Array in DB (its the only Array), push each member to a new Array
                //Check the new array for user param, if undefined push to array and update DB
                if(group.find(members => members instanceof Array) != undefined){
                  let groupmembers = group.find(members => members instanceof Array).map((member)=>groupArray.push(member));
                  let member = groupArray.find(m => m === username);
                      if(member == undefined){
                        groupArray.push(username)
                      // console.log(username)
                          return  (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({ groupmembers: groupArray })
                        }else{
                          // console.log(group)
                          return group
                        }
                      }
              })

        }

    public setGroupComplete(groupname:string, toggle:boolean){
        (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({ completed: toggle });
      }

  //This is called in group service, when socket is emitted
    public updateUser(userInfo, username, groupname){
        return  (this._af.database.object('/userTotals/'+groupname+"/"+username) as FirebaseObjectObservable<any>).update(userInfo);
    }

    public checkGroup(groupname: Observable<string>){
      //Checks is Groupname is in use
      return groupname.debounceTime(300)
      .distinctUntilChanged()
      .switchMap(
        groupname => {
          // console.log(groupname)
        return (this._af.database.list('/groups/'+groupname) as FirebaseListObservable<Group[]>)
           .map((group) =>{
            //  console.log(group)
             return group;
           })
      })
    }

    public setGroup(group:Group, groupname:string){
      // console.log(group)
      return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).set(group);
      }

    public checkifInGroup(groupname){
      return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<any>);
    }


    public deleteReceipt(groupname, username){
        let groupArray = [];
        //  console.log(groupname, username)
      return (this._af.database.list('/groups/'+groupname) as FirebaseListObservable<Group[]>)
        .map((group) =>{
        let groupmembers = group.find(members => members instanceof Array)
          if(groupmembers === undefined){
                return;
          }
            groupmembers.map((member)=>groupArray.push(member));
            //If only 1 member delete all
          if(groupArray.length == 1){
              (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).remove();
              (this._af.database.object('/userTotals/'+groupname) as FirebaseObjectObservable<Group>).remove();
                groupArray = [];
            return group;
          }else {
            //Else, remove member from copied array and update DB
          let member = groupArray.indexOf(username);
              if(member > -1){
                  groupArray.splice(member, 1)
                  // return group
                  return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({ groupmembers: groupArray })
                    }else{
                      return group;
                  }
          }
      })

    }

  public checkIfUserNameExist(user){

    return (this._af.database.object('/users/'+user) as FirebaseObjectObservable<any>)
      .map(res=>{
        return res;
    })

  }

  createUser(username){
    let userdetails:UserDetails =  {
          username:username,
          date_created: null
    };
    return (this._af.database.object('/users/'+username) as FirebaseObjectObservable<any>).set(userdetails);
  }
  public updateGroup(groupname, totalBillAmount){
    return (this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<Group>).update({ totalBillAmount: totalBillAmount });
  }

}
