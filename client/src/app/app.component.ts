import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import  firebase  from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { StartPage } from '../pages/start/start';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = StartPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      firebase.initializeApp({
        apiKey: "AIzaSyC3qAPEduU2aFCHrgcEcyzOM-gcp_7-3dg",
        authDomain: "goingdutch-1490195424422.firebaseapp.com",
        databaseURL: "https://goingdutch-1490195424422.firebaseio.com",
        projectId: "goingdutch-1490195424422",
        storageBucket: "goingdutch-1490195424422.appspot.com"
      });
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
