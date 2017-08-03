import { Component, ViewChild} from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { GroupService } from '../services/group.service';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserdetailsPage } from '../pages/userdetails/userdetails';
import { TabsPage } from '../pages/tabs/tabs';
import { UserInfo } from '../models/userAmount.model';
import 'rxjs/Rx';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;
  private allUsers: UserInfo[] = [];

  @ViewChild('nav') nav: NavController;//Need to do this to get access to NavController
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private groupService: GroupService) {

    platform.ready().then(() => {
          this.groupService.passParams
            .subscribe((data)=>{
              if(data){
               this.allUsers = data[1];
            return this.allUsers;
          }
        })
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  public showUserInfo(groupname, user){
    if(user){
      this.nav.push(UserdetailsPage, {groupname:groupname, username:user });
    }
    console.log(user)
  }
}
