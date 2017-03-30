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
import { LocationService } from '../services/location.service';
import { AgmCoreModule } from 'angular2-google-maps/core';


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
    })
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
    LocationService
  ]
})
export class AppModule {}
