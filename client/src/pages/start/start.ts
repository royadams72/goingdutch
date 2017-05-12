import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminPage } from '../admin/admin';
import { UserPage } from '../user/user';
import { UserService } from '../../services/user.service';
import { AfService } from '../../services/af.service';
@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage implements OnInit {

  constructor(private afService:AfService, public navCtrl: NavController, private userService: UserService) {
  this.afService.getInfo();

  this.userService.checkUserName();
   console.log("getUserName= "+this.userService.getUserName())
  }



private onAction(action){
 if(this.userService.getUserName() === null){
   this.userService.checkUserName();
     }else if(action == 'createGroup'){
          this.navCtrl.push(AdminPage);
        }else if(action == 'joinGroup'){
          this.navCtrl.push(UserPage, {completed:false});
        }else{
          this.navCtrl.push(UserPage, {completed:true});
        }
  }

  ngOnInit(){

  }



}
