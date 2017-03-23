import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Location } from '../../models/location.model'
import * as io from 'socket.io-client';
import rg from 'simple-reverse-geocoder';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
private socket: any;
private url = 'http://localhost:3000';
private messages: any = [];
private message:string;
private username:string;
private connection: any;
private location: Location = {
    lat: 4646464646,
    lng: 767676767
};
  constructor(public navCtrl: NavController) {}

  ngOnInit(){
      this.connection = this.getMessages().subscribe((message:string) => {
        this.messages.push(message);
        console.log(message);
      })
    this.getGeoLocation()
  }

  getLocation(){
  const loc = {type: 'Point', coordinates: [this.location.lng, this.location.lat]};
   return rg.getAddress(loc).then((place) => console.log(place))
  .catch(error => console.log(error.message));
  }

  send(){
    if(this.message.trim() != ""){

      this.socket.emit('message', this.message, this.username);
    }
    this.message= '';
  }

  getMessages(){
    let observable = new Observable((observer:any) => {
      this.socket = io(this.url);
      this.socket.on('message', (data:any) => {
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
getGeoLocation(){
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
  ngOnDestroy(){
    this.connection.unsubscribe();
  }

}
