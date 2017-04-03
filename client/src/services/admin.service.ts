import { Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Location } from '../models/location.model'
import { Group } from '../models/group.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';

import 'rxjs/Rx';
@Injectable()
export class AdminService {
  private socket: any;
  private url = 'http://localhost:3000';
  public groupname: string;
  public currBillAmount:number;
  public  totalBillAmount:number
  private username:string;
  private group:Group;
  private address:EventEmitter<string> = new EventEmitter();
  private address2:string;
  private location: Location = {
      lat: 4646464646,
      lng: 767676767
  };
  constructor(private http: Http) {
    this.socket = io(this.url);
   }

upDateItems(totalBillAmount,groupname, userAmount, username){
  this.socket.emit('update-receipt', totalBillAmount, groupname, userAmount, username);
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
     this.address.emit(address);
     this.address2 = address;

  // console.log(address);
   this.sendInvite(address);
 })
.catch(error => console.log(error.message));
}
getAddress(){

  return this.address;
}
private sendInvite(address){

    this.socket.emit('invite',this.totalBillAmount, this.totalBillAmount, this.groupname, address);

      //  console.log(this.group)


    //console.log(this.totalBillAmount)
}
sendData(address){
  this.group = new Group(this.groupname, this.totalBillAmount, address);

  return this.http.put('https://goingdutch-1490195424422.firebaseio.com/groups/'+this.groupname+'.json', this.group)
  .map((response: Response) => {

     //this.joinGroup(this.groupname);
      return response.json();

  })

}

getItems(){
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
joinGroup(groupname){
this.socket.emit('group', groupname);
console.log(groupname)
}

}
