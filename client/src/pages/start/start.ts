import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminPage } from '../admin/admin';
import { UserPage } from '../user/user';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage implements OnInit {

  constructor(public navCtrl: NavController) {}

  setUser(){
    this.navCtrl.push(UserPage);
  }

  setAdmin(){
    this.navCtrl.push(AdminPage)
  }

  ngOnInit(){

  }



}
