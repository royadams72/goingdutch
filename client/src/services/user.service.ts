import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Location } from '../models/location.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';

@Injectable()
export class UserService {
  private socket: any;
  private url = 'http://localhost:3000';
  public groupname: string;
  private address:EventEmitter<string> = new EventEmitter();;
  private adminAddress:string;
  public currBillAmount:number;
  public  totalBillAmount:number
  private username:string;


  private location: Location = {
      lat: 4646464646,
      lng: 767676767
  };
  constructor() {
    this.socket = io(this.url);
   }



upDateItems(currBillAmount, totalBillAmount,groupname, userAmount, username){
  this.socket.emit('items-updated',currBillAmount, totalBillAmount, groupname, userAmount, this.username);
}

public setUser(totalBillAmount, groupname, address){
  this.currBillAmount = totalBillAmount;
  this.totalBillAmount = totalBillAmount;
  this.adminAddress = address;
  this.groupname = groupname;
  this.getGeoLocation();
}

getLocation(){

const loc = {type: 'Point', coordinates: [this.location.lng, this.location.lat]};
 return rg.getAddress(loc).then((address) => {
   if(this.adminAddress == address){
      this.address.emit(address);
  console.log(address, "adminAddress= "+this.adminAddress);
}
   //this.sendInvite(address);
 })
.catch(error => console.log(error.message));
}

getAddress(){
    //console.log(this.address);
  return this.address;
}
getInvites(){

  let observable = new Observable((observer:any) => {
  //
    this.socket.on('invit', (data:any) => {
      //console.log(data.address);
      observer.next(data);
    })
      return () => {
        this.socket.disconnect();
      }
  })
  return observable;
}

getUserName(){
  return sessionStorage.getItem('username')
}

setUserName(){

  sessionStorage.setItem('username', this.username);
  //this.username = '';
}
public getGeoLocation(){

Geolocation.getCurrentPosition()
  .then(
    location => {
      this.location.lat = location.coords.latitude;
      this.location.lng = location.coords.longitude;
      this.getLocation();

    }
  ).catch((error) => {
console.log('Error getting location', error);
});
}
  joinGroup(groupname){
  this.socket.emit('group', groupname);
  }
}
