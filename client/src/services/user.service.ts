import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Location } from '../models/location.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Group } from '../models/group.model';

@Injectable()
export class UserService {
  private socket: any;
  private url = 'http://localhost:3000';
  private username:string;
  groups:FirebaseListObservable<Group[]>;

  constructor(private http: Http, private _af:AngularFire) {
    this.socket = io(this.url);
   }

  upDateItems(currBillAmount, totalBillAmount,groupname, userAmount, username){
    this.socket.emit('update-receipt',currBillAmount, totalBillAmount, groupname, userAmount, this.username);
  }

  getGroups(){
    this.groups = this._af.database.list('/groups') as
    FirebaseListObservable<Group[]>;
    return this.groups;
  }
  getUserName(){
    return sessionStorage.getItem('username')
  }

  setUserName(){
    sessionStorage.setItem('username', this.username);

  }

  joinGroup(groupname){
    this.socket.emit('group', groupname);
  }
}
