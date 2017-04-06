import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AfService } from '../../services/af.service';
import { GroupService } from '../../services/group.service';
import { FeedbackService } from '../../services/feedback.service';
import { UserAmount } from '../../models/userAmount.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Group } from '../../models/group.model'
import { Geolocation } from 'ionic-native';
import { Location } from '../models/location.model';
import rg from 'simple-reverse-geocoder';

@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage implements OnInit {
  private groupForm: FormGroup;
  private connection: any;
  private totalBillAmount: number;
  private currBillAmount: number;
  private userAmountTotal:number;
  private userAmount:number;
  private allUsers: UserAmount[] = [];
  private groupname: string;
  private username:string;
  private userType:string;
  private loaded:boolean;
  private lm:string;
  private group:Group;
  data:any;

  constructor(private navParams: NavParams,
              private afService:AfService,
              private groupService: GroupService,
              private feedbackService: FeedbackService) {

     this.totalBillAmount = this.currBillAmount = parseInt(navParams.get('totalBillAmount'));
     this.groupname = navParams.get('groupname');
     this.username = navParams.get('username');
     this.userType = navParams.get('userType');
     this.userAmountTotal = 0;
     this.lm = "Please wait.."

    // console.log(this.username)

   }

ngOnInit() {
    this.loaded = false;
    this.feedbackService.startLoader(this.lm);
    if(this.userType==='user'){
      // console.log(this.username)
        this.groupService.joinGroup(this.groupname);
      //  this.afService.getSetUsers(this.groupname).subscribe(data=>console.log(data))//
        this.loaded = true;
        this.feedbackService.stopLoader();
        //this.afService.setUsers(this.groupname);
        this.initForm();
      }else{
    Geolocation.getCurrentPosition()
        .then((location) => {
          const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
            return rg.getAddress(loc).then((address) => {
                this.group = new Group(this.groupname, this.totalBillAmount, address);
                  //console.log(this.group)
               this.afService.setGroup(this.group);
                this.afService.createUser(this.username, this.groupname)
                this.groupService.joinGroup(this.groupname);
                this.loaded = true;
                this.feedbackService.stopLoader();
                //this.afService.setUsers();
                this.initForm();
              //  console.log(this.loaded)
              }).catch(error => console.log(error.message));
            }//End Location
        ).catch((error) => {
        console.log('Error getting location', error);
      });
  }

this.loadReceipt();
}
loadReceipt(){
  this.connection = this.groupService.getItems().subscribe((data) => {

      this.currBillAmount  = this.totalBillAmount;
      this.userAmountTotal = 0;
      this.data = data;
      this.userAmount = parseInt(this.data.userAmount);
  let userInfo = new UserAmount(this.data.userAmount,this.data.username, this.data.groupname)
  let found = this.userExists(this.data.username, this.allUsers);
//  console.log(this.data.groupname)
    //console.log(typeof this.allUsers)
  //Uses an array to keep track of totals
     /* If this user found in array, find index and replace
     if not found, push */

       //console.log(data[i].key)}

  if(found){
      for(let i = 0; i < this.allUsers.length; i++){

          if(this.allUsers[i].username === this.data.username){
                this.allUsers[i] = userInfo;
          }
        }
      }else{
        this.allUsers.push(userInfo);
    }

    this.groupService.update(this.allUsers);
  //  console.log()
if(this.userType !='user'){
    this.afService.updateUserAmount(this.allUsers);
}
    for(let i = 0; i < this.allUsers.length; i++){
         this.userAmountTotal = this.userAmountTotal + parseInt(this.allUsers[i].userAmount);
      }

        this.currBillAmount  = (this.currBillAmount) - this.userAmountTotal;

  })
}
private ifReceiptExists(){

}
private userExists(username, arr) {
   return arr.some(function(el) {
     return el.username === username;
   });
 }

private initForm(){
    let items = [];
      this.groupForm = new FormGroup({
            'items': new FormArray(items)
      });
      this.addItemFields();
}

private addItemFields(){
    for(let i = 0; i < 5; i++){
       (<FormArray>this.groupForm.get('items'))
        .push(new FormControl(null))//Explicitly cast to FormArray, as typscript doesn't know it should be an array
    }
}

private calculateItems(){
    this.userAmount = this.userAmount || 0;
    let fArray: FormArray = <FormArray>this.groupForm.get('items');
    const len = fArray.length;
    let itemAmount: number = this.groupForm.get('items').value;

    this.userAmount = 0;
    for(let i =0; i < len; i++ ){
      this.userAmount += +itemAmount[i];
    }

    this.groupService.upDateItems( this.totalBillAmount, this.groupname, this.userAmount, this.username);
}

  ngOnDestroy(){
   this.connection.unsubscribe();
  }
}
