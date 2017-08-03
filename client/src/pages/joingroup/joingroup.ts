
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { GroupService } from '../../services/group.service';
import { AfService } from '../../services/af.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group.model';
import { FeedbackService } from '../../services/feedback.service';
import { GroupPage } from '../group/group';
import { Geolocation } from 'ionic-native';
import { HaversineService, GeoCoord} from "ng2-haversine";
import { GroupAdminPage } from '../groupadmin/groupadmin';
//import rg from 'simple-reverse-geocoder';

@Component({
  selector: 'page-joingroup',
  templateUrl: 'joingroup.html',
})
export class JoinGroupPage {
  private connections:Array <any> = [];
  public  groups:Group[] = [];
  private completed:boolean;
  private loading:any;
  private loadingMessage:string;
  private loaded:boolean;
  private username:string;
  private userType:string;
  public distance:number;

constructor(private navParams: NavParams,
            private navCtrl: NavController,
            private afService:AfService,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            private FeedbackService: FeedbackService,
            private hsService: HaversineService,
            private userService: UserService,
            private groupService: GroupService) {}
  ionViewWillEnter() {
      this.afService.getInfo();
      this.userService.checkUserName();//Check if user exists
     //If so, emits userName observalbe
      let connection = this.userService.emitUsername
        .subscribe(data=>{
          console.log(data)
          data !== null ? this.fetchGroups() : this.userService.setUserName();
        },
      error => this.FeedbackService.showError(error.message)
    )
        this.connections.push(connection);
  }


  private fetchGroups(){
    if(!this.loaded){
      let connection;
      this.completed = this.navParams.get('completed');
      this.username = this.userService.getUserName();
      console.log(this.completed)
          if(this.completed){
            this.loadingMessage = "Looking for previous Groups<br>Please wait...";
          }else{
            this.loadingMessage =  "Looking for nearby Groups<br>Please wait..."
          }
          // console.log('data')
          // this.fetchGroups();
          this.loaded = false;
          this.loader();
          console.log('loaded= '+this.loaded)
            Geolocation.getCurrentPosition()
              .then((location) => {
                console.log(location)
                //Get this users coords
                let userAddress: GeoCoord = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                    };
                  connection = this.afService.getGroups(this.completed, this.username)
                    .subscribe((firebaseData) => {
                        //Connect to firebase get groupinfo including, coords of it's creation
                      this.groups = []
                      firebaseData
                        .filter(groupData => groupData !==undefined )
                          .map((groupData)=>{
                            /*If not completed, make sure the distance/radius
                            of returned groups are less than 10 meters away */
                              if(!this.completed){
                                   let groupAddress: GeoCoord = {
                                      latitude: groupData.address.latitude,
                                      longitude: groupData.address.longitude
                                    };
                                    console.log(groupAddress);
                                    let distanceInMeters = this.hsService.getDistanceInMeters(userAddress, groupAddress);
                                         this.distance = distanceInMeters;
                                          if(distanceInMeters < 10){
                                              this.handleGroupInfo(groupData);
                                          }
                                      }else{
                                        this.handleGroupInfo(groupData);
                                  }
                              })
                      this.loaded = true;
                      this.loading.dismiss();
                     })
        }).catch((error) => {
      return this.FeedbackService.showError(error.message);
      });
      this.connections.push(connection)
    }
  }

  public createGroup(){
      this.navCtrl.setRoot(GroupAdminPage);
   }

   private handleGroupInfo(groupData){
  // console.log(groupData)
    let groupcode
      if(this.username == groupData.admin || groupData.groupmembers.indexOf(this.username) != -1){
        //If you are the admin for this group or, you are in the groupmembers array (You have already been here)
        groupcode = 0;
        }else{
          //You have to input a code
        groupcode =  groupData.groupcode;
      }
      let groupInfo = new Group(groupData.groupname, groupData.admin, groupData.totalBillAmount, groupData.address, groupData.completed, groupcode, groupData.groupmembers);
          this.groups.push(groupInfo);
  }


  private joinGroup(groupname, groupcode, admin, totalBillAmount){
    let gotoPage
    let joining_group:boolean;
    let titleTxt: string = 'Please enter the 4 digit pass code provided by the group creator';
          this.completed == true ? joining_group = false : joining_group = true;
          admin == this.username ? this.userType = 'admin' : this.userType = 'user';
          gotoPage = this.navCtrl.push(GroupPage, {groupname:groupname, userType: this.userType, totalBillAmount:totalBillAmount, completed: this.completed, joining_group: joining_group});
            if(groupcode == 0){
                gotoPage
                return;
            }
          this.userService.getGroupcode(titleTxt, groupcode, gotoPage)
  }

  private loader(){
    this.loading = this.loadingCtrl.create({
      content: this.loadingMessage
    });
    this.loading.present();
  }

  ionViewDidLeave(){
    for(let i = 0; i < this.connections.length; i++){
      if(this.connections[i] != undefined){
        this.connections[i].unsubscribe();
      }
    }
  }

}
