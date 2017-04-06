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
import  'rxjs/Rx'
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
     this.lm = "Please wait..";

   }

ngOnInit() {
    this.loaded = false;
    this.feedbackService.startLoader(this.lm);
    if(this.userType==='user'){
        this.groupService.joinGroup(this.groupname);
        this.loaded = true;
        this.feedbackService.stopLoader();
        this.initForm();
      }else{
    Geolocation.getCurrentPosition()
        .then((location) => {
          const loc = {type: 'Point', coordinates: [location.coords.longitude, location.coords.latitude]};
            return rg.getAddress(loc).then((address) => {
                this.group = new Group(this.groupname, this.totalBillAmount, address);
               this.afService.setGroup(this.group);
                this.groupService.joinGroup(this.groupname);
                this.loaded = true;
                this.feedbackService.stopLoader();
                this.initForm();
              }).catch(error => console.log(error.message));
            }//End Location
        ).catch((error) => {
        console.log('Error getting location', error);
      });
  }

this.loadReceipt();
}
loadReceipt(){
  this.afService.getUser(this.username, this.groupname);//bind to firebase groups, which is updated in the group service
  if(this.receiptExists() != undefined){
    let loadfirebase = this.afService.getUsers(this.groupname).subscribe(
      (data)=>{
        for(let i = 0; i < data.length; i++){
          let userInfo = new UserAmount(data[i].userAmount,data[i].username, data[i].groupname);
            this.allUsers.push(userInfo)
        }
        //this.allUsers = allUsers;
        console.log(this.allUsers)
        this.updateView();
        loadfirebase.unsubscribe()
      }
  );
}
  this.connection = this.groupService.getItems().subscribe((data) => {
      this.currBillAmount  = this.totalBillAmount;
      this.userAmountTotal = 0;
      this.data = data;
      this.userAmount = parseInt(this.data.userAmount);
  let userInfo = new UserAmount(this.data.userAmount,this.data.username, this.data.groupname)
  let found = this.userExists(this.data.username, this.allUsers);

  if(found){
      for(let i = 0; i < this.allUsers.length; i++){

          if(this.allUsers[i].username === this.data.username){
                this.allUsers[i] = userInfo;
          }
        }
      }else{
        this.allUsers.push(userInfo);
    }
  this.updateView();
  })
}

private updateView(){
  this.groupService.update(this.allUsers);
  for(let i = 0; i < this.allUsers.length; i++){
       this.userAmountTotal = this.userAmountTotal + parseInt(this.allUsers[i].userAmount);
    }
      this.currBillAmount  = (this.currBillAmount) - this.userAmountTotal;
}
private receiptExists(){
    return this.afService.getUsers(this.groupname)//Get all users
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

    this.groupService.upDateItems(this.totalBillAmount, this.groupname, this.userAmount, this.username);

}

  ngOnDestroy(){
   this.connection.unsubscribe();
  }
}
