
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';

import { AfService } from '../../services/af.service';
import { UserService } from '../../services/user.service';
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
export class UserPage {

  private totalBillAmount:number
  private connection: any;
  private connections:Array<any> = [];
  public  groups:Group[] = [];
  private completed:boolean;
  private location:Location;
  private loading:any;
  private loaded:boolean;
  private username:string;
  private groupname:string;
  private isRejoiningUser:any;
  private userType:string;
  private groupcode:number;
    d:number
constructor(private navParams: NavParams,
            private navCtrl: NavController,
            private afService:AfService,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            private FeedbackService: FeedbackService,
            private hsService: HaversineService,
            private userService: UserService) {


 }
  ionViewWillEnter() {
    //this.groups = [];
    this.completed = this.navParams.get('completed');
    this.username = this.userService.getUserName();
    this.fetchGroups();
    this.loaded = false;
    this.loader();
  //console.log(this.username)
    }

private fetchGroups(){

  if(!this.completed){
    //USER LOGIC
      //If not completed; get this users coords

  Geolocation.getCurrentPosition()
    .then((location) => {
          let userAddress: GeoCoord = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
            };
           //Get groups from firebase and match coords using Haversine formular
            this.connection = this.afService.getGroups(this.completed, this.username)
            .subscribe((firebaseData) => {
              this.groups = []
              firebaseData.map((groupData)=>{
              //  console.log(groupData.groupcode)
                let groupAddress: GeoCoord = {
                    latitude: groupData.address.latitude,
                    longitude: groupData.address.longitude
                    };
                let distanceInMeters = this.hsService.getDistanceInMeters(userAddress, groupAddress);
                  this.d = distanceInMeters
                    if(distanceInMeters < 10){
                     console.log(this.d);
                      this.handleGroupInfo(groupData);

                    }

            })

          this.loaded = true;
          this.loading.dismiss();
         })
    }).catch((error) => {
return this.FeedbackService.showError(error.message);
});
    }else if(this.completed){
      this.connection = this.afService.getGroups(this.completed, this.username)
      .subscribe((firebaseData) => {
        this.groups = []
        firebaseData.map((groupData)=>{
                  this.handleGroupInfo(groupData);
            })


      this.loaded = true;
      this.loading.dismiss();
     })
    }
}
private handleGroupInfo(groupData){
  let groupcode
    if(this.username == groupData.admin || groupData.groupmembers.indexOf(this.username) != -1){
      groupcode = 0
      console.log("found")
      }else{
      groupcode =  groupData.groupcode;
    }
let groupInfo = new Group(groupData.groupname, groupData.admin, groupData.totalBillAmount, groupData.address, groupData.completed, groupcode, groupData.groupmembers);
    this.groups.push(groupInfo);
}


private joinGroup(totalBillAmount, groupname, completed, groupcode, admin){
//console.log(totalBillAmount, groupname, completed, groupcode, admin)
  if(admin == this.username){
        this.userType = 'admin';
        //groupcode = 0;
    }else{
        this.userType = 'user';
        //groupcode = 0;
    }

  let titleTxt: string = 'Please enter the 4 digit pass code provided by the group creator';
  if(groupcode == 0){
      //this.navCtrl.pop();
        this.navCtrl.push(GroupPage, {totalBillAmount: totalBillAmount, groupname:groupname, completed: completed, userType: this.userType, groupcode:groupcode});

        return;
  }


        let alert = this.alertCtrl.create({
          title: titleTxt,
          inputs: [
            {
            name: 'groupcode',
            placeholder: 'Groupcode',
            type: 'number'
            }
          ],
          buttons:[ {
              text: 'Send Code',
                handler: (data) => {
                  //console.log(data.groupname, groupname)
                  if(data.groupcode == groupcode){
                    alert.dismiss().then(() => {
                      this.navCtrl.push(GroupPage, {totalBillAmount: totalBillAmount, groupname:groupname, completed: completed, userType: this.userType, groupcode:groupcode});
                    });
                  }else{
                    data.groupname ='';
                    titleTxt = "There has been an issue with your groupcode please try again"
                  }
                }
              }
            ]
        });
      alert.present();
}


private loader(){
  this.loading = this.loadingCtrl.create({
    content: "Looking for nearby Groups<br>Please wait..."
  });
  this.loading.present();
}

  ionViewDidLeave(){
  //  console.log('left')

  this.connection.unsubscribe();
  for(let i = 0; i < this.connections.length; i++){
    this.connections[i].unsubscribe();
    //  console.log(this.connections[i])
  }

  }
}
