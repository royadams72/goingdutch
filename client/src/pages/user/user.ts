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
  private connection1: any;
  private connection2: any;
  private connection3: any;
  private connArray: Array<any> = [];
  private data: any;
  public groups: any = [];
  private n:number = Math.round(Math.random() * (100 - 50));
          num = this.n.toString()
  private username = "TestUser"+this.num;
  private location: Location;

//ref = firebase.database().ref("users/ada");
constructor(private userService: UserService, private navCtrl: NavController) {

  //this.ref = firebase.database().ref('groups'); // Get a firebase reference to the todos

 }
  ngOnInit() {
    this.fetchGroups();
      //console.log("Fired")
/*this.connection3 = this.userService.fetchList().subscribe((data) => {
console.log(data)
})*/

  /*  this.connection1 = this.userService.getInvites().subscribe((data) => {
      this.data = data
       this.userService.setUser(this.data.totalBillAmount, this.data.groupname, this.data.address)
              this.connection2 =  this.userService.getAddress().subscribe(userAddress=> {
                //console.log(this.data.address)
          //userAddress = "209 Grange Rd, London E13 0HB";
                if(userAddress==this.data.address){
                  this.groups.push(this.data);
                  console.log(this.groups)
                }
              })


  })*/

  //this.connArray.push(this.connection1, this.connection2)
}
  joinGroup(){


      this.navCtrl.push(GroupPage, {totalBillAmount: this.data.totalBillAmount, groupname:this.data.groupname, username: this.username, userType: "user"});

  }
private fetchGroups(){
  Geolocation.getCurrentPosition()
    .then(
      location => {
        const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
         return rg.getAddress(loc).then((address) => {
           this.connection3 = this.userService.getGroups().subscribe((data) => {

           this.data = data;

             this.groups.push(...this.data);


               console.log(this.groups[0].address)



           })
         })
        .catch(error => console.log(error.message));

      }
    ).catch((error) => {
  console.log('Error getting location', error);
  });
}

  ngOnDestroy(){
    console.log("unsubscribed")
  /*  for(let i = 0; i < this.connArray.length; i++){
      this.connArray[i].unsubscribe()
    }*/
  this.connection1.unsubscribe();
  this.connection2.unsubscribe();
  }
}
