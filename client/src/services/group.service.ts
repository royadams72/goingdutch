import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GroupService {
  private socket: any;
  private url = 'http://localhost:3000';
  private username:string;


constructor(private _af:AngularFire) {
                  this.socket = io(this.url);
 }

  upDateItems(totalBillAmount,groupname, userAmount, username){
    this.socket.emit('update-receipt',totalBillAmount, groupname, userAmount, this.username);
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


  joinGroup(groupname){
    this.socket.connect();
    this.socket.emit('group', groupname);
    console.log(groupname)
  }

}
