import { Component, ViewChild} from '@angular/core';
import { Platform } from 'ionic-angular';
import { NavController, MenuController } from 'ionic-angular';
import { GroupService } from '../services/group.service';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StartPage } from '../pages/start/start';
import { UserAmount } from '../models/userAmount.model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = StartPage;
  private allUsers: UserAmount[] = [];

  @ViewChild('nav') nav: NavController;//Need to do this to get access to NavController
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private groupService: GroupService) {
      platform.ready().then(() => {
        this.groupService.updateArr.subscribe((data:UserAmount[])=>{
        this.allUsers = data;
        //  console.log(typeof data)
        })
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
