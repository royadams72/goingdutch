import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
private socket: any;
private url = 'http://localhost:3000';
messages: any = [];
message:string;
username:string;
connection: any;

  constructor(public navCtrl: NavController) {}

  ngOnInit(){
      this.connection = this.getMessages().subscribe((message:string) => {
        this.messages.push(message);
        console.log(message);
      })
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

  ngOnDestroy(){
    this.connection.unsubscribe();
  }

}
