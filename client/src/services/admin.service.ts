import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';

import { Location } from '../models/location.model'
import { Group } from '../models/group.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';


import 'rxjs/Rx';
@Injectable()
export class AdminService {
  private socket: any;
  private url = 'http://localhost:3000';



  constructor(private http: Http) {
    // this.socket = io(this.url);
   }

  getUserName(){
    return sessionStorage.getItem('username')
  }

  setUserName(){
  //  console.log('Username set '+this.username);
  //  sessionStorage.setItem('username', this.username);
    //this.username = '';
  }


}
