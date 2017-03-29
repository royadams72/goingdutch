import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Location } from '../models/location.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';

@Injectable()
export class AdminService {
  private socket: any;
  private url = 'http://localhost:3000';
  public groupname: string;
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

public setGroup(totalBillAmount, groupname){
  this.currBillAmount = totalBillAmount;
  this.totalBillAmount = totalBillAmount;
  this.groupname = groupname;
  this.getGeoLocation();
}

getLocation(){
const loc = {type: 'Point', coordinates: [this.location.lng, this.location.lat]};
 return rg.getAddress(loc).then((address) => {
  // console.log(address);
   this.sendInvite(address);
 })
.catch(error => console.log(error.message));
}

private sendInvite(address){
    this.socket.emit('invite',this.totalBillAmount, this.totalBillAmount, this.groupname, address);
    console.log(this.totalBillAmount)
}

getItems(){
  let observable = new Observable((observer:any) => {

    this.socket.on('upDateItems', (data:any) => {
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
  console.log('Username set '+this.username);
  sessionStorage.setItem('username', this.username);
  //this.username = '';
}
private getGeoLocation(){
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
  joinGroup(){

  }

}
