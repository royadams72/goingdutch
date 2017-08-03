import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ReceiptComponent } from './component/receipt_display/receipt.component';
import { GroupFormComponent } from './component/groupform/groupform.component';

import { GroupAdminPage } from '../pages/groupadmin/groupadmin';
import { JoinGroupPage } from '../pages/joingroup/joingroup';
import { GroupPage } from '../pages/group/group';
import { UserdetailsPage } from '../pages/userdetails/userdetails';
import { TabsPage } from '../pages/tabs/tabs';

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
    GroupAdminPage,
    GroupPage,
    JoinGroupPage,
    UserdetailsPage,
    TabsPage,
    ReceiptComponent,
    GroupFormComponent
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
    GroupAdminPage,
    GroupPage,
    JoinGroupPage,
    UserdetailsPage,
    TabsPage
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
