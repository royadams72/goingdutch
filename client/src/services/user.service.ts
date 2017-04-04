import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { Group } from '../models/group.model';

@Injectable()
export class UserService {
  private socket: any;
  private url = 'http://localhost:3000';
  private username:string;


  constructor() {
  this.socket = io(this.url);
   }


  getUserName(){
    return sessionStorage.getItem('username')
  }

  setUserName(){
    sessionStorage.setItem('username', this.username);
  }


}
