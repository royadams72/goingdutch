import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { AfService } from '../../services/af.service';
import { Group } from '../../models/group.model';
import { FeedbackService } from '../../services/feedback.service';
import { GroupPage } from '../group/group';
import { Geolocation } from 'ionic-native';
import rg from 'simple-reverse-geocoder';

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
            private FeedbackService: FeedbackService) {
              this.loaded = false;
              this.loader();

 }
  ngOnInit() {
    this.fetchGroups();

    }

private fetchGroups(){
  Geolocation.getCurrentPosition()
    .then((location) => {
        const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
        this.lat = location.coords.latitude; this.ln = location.coords.longitude
         return rg.getAddress(loc).then((userAddress) => {
           this.address = userAddress
            this.connection = this.afService.getGroups().subscribe((data:Group[]) => {
              this.groups = [];
                  for (let i in data) {
                    if(data[i].address == userAddress){
                      let groupInfo = new Group(data[i].groupname,data[i].totalBillAmount, data[i].address, data[i].complete);
                      this.groups.push(groupInfo);
                    }
                  }

            this.loaded = true;
            this.loading.dismiss();
           })
         })
        .catch(error => {return this.FeedbackService.showError(error.message)});
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
