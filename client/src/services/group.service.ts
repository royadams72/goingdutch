import { Injectable, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs/Observable';
import { AfService } from '../services/af.service';
import { UserAmount } from '../models/userAmount.model';
import { Geolocation } from 'ionic-native';
import { Location } from '../models/location.model';
@Injectable()
export class GroupService {
  private socket: any;
  private url = 'https://going-dutch.herokuapp.com';
  private allUsers: UserAmount[] = [];
  updateArr = new BehaviorSubject<Array<any>>([]);

constructor(private _af:AngularFire,
            private afService:AfService,) {
            this.socket = io(this.url);

 }

public getOldAmounts(oldAmount,username, groupname){
  return  this.afService.getOldAmounts(groupname).map(
    (data)=>{
      for(let i = 0; i < data.length; i++){
        let userInfo = new UserAmount(data[i].userAmount, data[i].username, data[i].groupname);
          if(username == data[i].username){//Get the previous amount fo this user and put into var
            oldAmount = data[i].userAmount;//This will make sure that the amount in the db is added to rather than overwritten
          }
          this.allUsers.push(userInfo);//Push all  amounts to array and update the view
      }
      return this.allUsers;
    }
);

}

  upDateItems(totalBillAmount,groupname, userAmount, username){
    let userInfo = new UserAmount(userAmount, username, groupname)
        this.afService.updateUserAmount(userInfo, username, groupname);//Update firebase database
        this.socket.emit('update-receipt',totalBillAmount, groupname, userAmount, username);
  }

  disconnectUsers(groupname){
        this.socket.emit('completed', groupname);
  }


  getItems(){
      //This observes info being sent to socket, for calculation
      let observable = new Observable((observer:any) => {
        this.socket.on('receipt-updated', (data:any) => {
          observer.next(data);
        })
          return () => {
            this.socket.disconnect();
          }
      })
      return observable;
  }

  checkIfComplete(){
      //Function for users can watch for when administrator has marked receipt as completed
      let observable = new Observable((observer:any) => {
        this.socket.on('receipt-completed', (data) => {
          console.log("observable-fired")
          observer.next(data);
        })
      })
      return observable;
  }

update(arr: Array<any>){
  this.updateArr.next(arr);
}


public  joinGroup(groupname){
    this.socket.connect();
    this.socket.emit('group', groupname);
  //  console.log(groupname)
  }

public createGroup(groupname, username, totalBillAmount, groupcode){
  return Geolocation.getCurrentPosition()
      .then((location) => {
      //When creating a group
        let address:Location = new Location(location.coords.latitude, location.coords.longitude);
            //creates group with Geolocation, so can match other users to this
            //Ada to a firebase database and joins/creates the socket.io group
            let group = new Group(groupname, username, totalBillAmount, address, false, groupcode, [username]);
              this.afService.setGroup(group, groupname);
              this.joinGroup(groupname);
              return group;
          }//End Location
      ).catch((error) => {
      console.log('Error getting location', error);
    });

}

}
