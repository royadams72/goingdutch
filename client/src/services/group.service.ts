import { Injectable, EventEmitter, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs/Observable';
import { AfService } from '../services/af.service';
import { UserAmount } from '../models/userAmount.model';
@Injectable()
export class GroupService {
  private socket: any;
  private url = 'https://going-dutch.herokuapp.com';
  updateArr = new BehaviorSubject<Array<any>>([]);

constructor(private _af:AngularFire,
            private afService:AfService,) {
            this.socket = io(this.url);

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

}
