import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AdminPage } from '../pages/admin/admin';
import { UserPage } from '../pages/user/user';
import { StartPage } from '../pages/start/start';
import { GroupPage } from '../pages/group/group';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';
import { FeedbackService } from '../services/feedback.service';
import { AfService } from '../services/af.service';

import { AgmCoreModule } from 'angular2-google-maps/core';
import { AngularFireModule, AuthMethods, AuthProviders } from 'angularfire2';
import { GroupService } from '../services/group.service';
import { HaversineService } from "ng2-haversine";

const afConfig = {
  apiKey: "AIzaSyC3qAPEduU2aFCHrgcEcyzOM-gcp_7-3dg",
  authDomain: "goingdutch-1490195424422.firebaseapp.com",
  databaseURL: "https://goingdutch-1490195424422.firebaseio.com",
  storageBucket: "goingdutch-1490195424422.appspot.com"
}
const afAuthConfig = {
  provider: AuthProviders.Anonymous,
  method: AuthMethods.Anonymous
};

@NgModule({
  declarations: [
    MyApp,
    StartPage,
    AdminPage,
    GroupPage,
    UserPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyBzC65IojRmZa8QArAXB0UsFFEf3HRnXc0'
    }),
    AngularFireModule.initializeApp(afConfig, afAuthConfig)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StartPage,
    AdminPage,
    GroupPage,
    UserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserService,
    AdminService,
    AfService,
    GroupService,
    FeedbackService,
    HaversineService
  ]
})
export class AppModule {}
