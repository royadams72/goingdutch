import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { GroupPage } from '../group/group';
import { Geolocation } from 'ionic-native';
import { Location } from '../models/location.model';
import rg from 'simple-reverse-geocoder';
import  firebase  from 'firebase';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage implements OnInit {

  private totalBillAmount:number
  private connection: any;

  private connArray: Array<any> = [];
  private data: any;
  public groups: any = [];
  private n:number = Math.round(Math.random() * (100 - 50));
          num = this.n.toString()
  private username = "TestUser"+this.num;
  private location: Location;

constructor(private userService: UserService, private navCtrl: NavController) {

 }
  ngOnInit() {
    this.fetchGroups();
    }

private fetchGroups(){
  Geolocation.getCurrentPosition()
    .then((location) => {
        const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
         return rg.getAddress(loc).then((userAddress) => {
            this.connection = this.userService.getGroups().subscribe((data) => {
             for(let i = 0; i < data.length; i++){
               if(data[i].address == userAddress){
                 this.groups.push(data[i]);
               }
             }
               console.log(this.groups)
           })
         })
        .catch(error => console.log(error.message));
      }
    ).catch((error) => {
  console.log('Error getting location', error);
  });
}
joinGroup(totalBillAmount, groupname){
    this.navCtrl.push(GroupPage, {totalBillAmount: totalBillAmount, groupname:groupname, username: this.username, userType: "user"});

}
  ngOnDestroy(){
    console.log("unsubscribed")
  this.connection.unsubscribe();
  }
}
