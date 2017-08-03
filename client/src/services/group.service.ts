import { Injectable, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs/Observable';

import { AfService } from '../services/af.service';
import { UserInfo } from '../models/userAmount.model';
import { Geolocation } from 'ionic-native';

import { Location } from '../models/location.model';
import 'rxjs/Rx';
@Injectable()
export class GroupService {
  private socket: any;
  private url = 'https://going-dutch.herokuapp.com';
  private allUsers: UserInfo[] = [];
  public group:any = [];
  public hasInitialised = false;

  public passParams = new BehaviorSubject<any>(null);
  constructor(private _af:AngularFire,
              private afService:AfService) {}

  public getGroupInfo(groupname, username){

    return Observable.combineLatest([
        this.getGroup(groupname, username),
        this.groupMembers(username, groupname)
    ])
      .map((data)=>{
        this.group = data;
        this.passParams.next(this.group);
        return this.group;
      })
  }

  public getGroup(groupname, username): Observable<any>{
    return  Observable.from(this._af.database.object('/groups/'+groupname) as FirebaseObjectObservable<any>)

    .map((group)=>{
      // console.log(group)
      return group
    })
    .catch((error) => {
      return Observable.throw(error)
    })
  }

  public groupMembers(username, groupname): Observable<any>{
    return   Observable.from(this.afService.getUserItems(groupname))
    .map((users:UserInfo[])=>{
      // console.log(users)
      return users
    })
    .catch((error) => {
      return Observable.throw(error)
    })
  }

  public upDateItems(totalBillAmount,groupname, userTotal, items,username){
      let userInfo = new UserInfo(items, userTotal, username, groupname)
        this.afService.updateUser(userInfo, username, groupname);//Update firebase database
  }

  public checkIfComplete(groupname){
      //Function for users can watch for when administrator has marked receipt as completed
      return (this._af.database.list('/groups/'+groupname) as FirebaseListObservable<Group[]>)
        .map((group) =>{
          // console.log(group.groupname, group.completed)
          return group
        })
  }

  public updateTotalBill(groupname, amount: Observable<number>){
    return amount.debounceTime(300)
      .distinctUntilChanged()
      .filter(amount => amount !== null )
      .switchMap(amount =>{
      return this.afService.updateGroup(groupname, amount);
    })
  }

  public createGroup(groupname, username, totalBillAmount, groupcode){
    //  console.log(groupname, username, totalBillAmount, groupcode)
    //  return groupname
    return Geolocation.getCurrentPosition()
        .then((location) => {
        //When creating a group
        let data

          let address:Location = new Location(location.coords.latitude, location.coords.longitude);
              //creates group with Geolocation, so can match other users to this
              //Ad to a firebase database
              data = new Group(groupname, username, totalBillAmount, address, false, groupcode, [username]);
              // console.log(group)
                this.afService.setGroup(data, groupname);
                return data;
            }//End Location
        ).catch((error) => {
        console.log('Error getting location', error);
      });

  }
}
