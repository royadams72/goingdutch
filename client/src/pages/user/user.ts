import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AfService } from '../../services/af.service';
import { Group } from '../../models/group.model';
import { FeedbackService } from '../../services/feedback.service';
import { GroupPage } from '../group/group';
import { Geolocation } from 'ionic-native';
import { HaversineService, GeoCoord} from "ng2-haversine";
//import rg from 'simple-reverse-geocoder';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage implements OnInit, OnDestroy {

  private totalBillAmount:number
  private connection: any;
  public groups: any = [];
  private n:number = Math.round(Math.random() * (100 - 50));
          num = this.n.toString()
  private username = "TestUser"+this.num;
  private location: Location;
  private loading:any;
  private loaded:boolean;
  private address:string;
  private lat:any;
  private ln:any;
constructor(private navCtrl: NavController,
            private afService:AfService,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            private FeedbackService: FeedbackService,
            private hsService: HaversineService) {
              this.loaded = false;
              this.loader();

 }
  ngOnInit() {
    this.fetchGroups();

    }

private fetchGroups(){
  //Get this users coords 
  Geolocation.getCurrentPosition()
    .then((location) => {
        const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
          let userAddress: GeoCoord = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
            };
           //Get groups from firebase
            this.connection = this.afService.getGroups().subscribe((firebaseData:Group[]) => {
              this.groups = [];
                  for (let i in firebaseData) {
                      if(firebaseData[i].address){//When addres is found in data
                        //Place into GeoCoord Object
                        let groupAddress: GeoCoord = {
                            latitude: firebaseData[i].address.latitude,
                            longitude: firebaseData[i].address.longitude
                            };
                            //Get the distanceInMeters of the two points
                        let distanceInMeters = this.hsService.getDistanceInMeters(userAddress, groupAddress);

                        if(distanceInMeters < 10){
                          let groupInfo = new Group(firebaseData[i].groupname, firebaseData[i].totalBillAmount, firebaseData[i].address, firebaseData[i].complete);
                          this.groups.push(groupInfo);
                      }
                    }
                  }

            this.loaded = true;
            this.loading.dismiss();
           })
      }
    ).catch((error) => {
  return this.FeedbackService.showError(error.message);
  });
}

private joinGroup(totalBillAmount, groupname){
    this.navCtrl.push(GroupPage, {totalBillAmount: totalBillAmount, groupname:groupname, username: this.username, userType: "user"});

}
private loader(){
  this.loading = this.loadingCtrl.create({
    content: "Looking for nearby Groups<br>Please wait..."
  });
  this.loading.present();
}




  ngOnDestroy(){
    console.log("unsubscribed")
  this.connection.unsubscribe();
  }
}
