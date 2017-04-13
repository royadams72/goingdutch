import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import { StartPage } from '../start/start';
import { AfService } from '../../services/af.service';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { FeedbackService } from '../../services/feedback.service';
import { UserAmount } from '../../models/userAmount.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Group } from '../../models/group.model'
import { Geolocation } from 'ionic-native';
import { Location } from '../../models/location.model';
//import rg from 'simple-reverse-geocoder';
import  'rxjs/Rx'
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage implements OnInit {
  private groupForm: FormGroup;
  private conn: any;
  private conn2: any;
  private conn3: any;
  private connections:Array<any> = [];
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
  private completed:boolean;
  private data:any;
  private groupcode:number;
  private groupmembers:Array<any> = [];
  constructor(private navParams: NavParams,
              private afService:AfService,
              private groupService: GroupService,
              private userService: UserService,
              private feedbackService: FeedbackService,
              private navCtrl: NavController) {

     this.totalBillAmount = this.currBillAmount = parseInt(navParams.get('totalBillAmount'));
     this.groupname = navParams.get('groupname');
     this.username = this.userService.getUserName();
     this.userType = navParams.get('userType');
     this.completed = navParams.get('completed');
     this.groupcode = navParams.get('groupcode');
     this.userAmountTotal = 0;
     this.lm = "Please wait..";
     this.conn3 = this.afService.checkifInGroup(this.groupname)
     .subscribe((data)=>{
        for( let i = 0; i < data.groupmembers.length; i++){
          this.groupmembers = data.groupmembers.slice();
        }
        if(this.groupmembers.indexOf(this.username) === -1){
            this.groupmembers.push(this.username)
        }
         this.afService.updateGroupmembers(this.groupname, this.groupmembers)
         .then((data)=>{
           console.log(this.groupmembers)
         })


     })


   }

ngOnInit() {

   //console.log(this.userType, this.completed)
    this.loaded = false;
    //this.feedbackService.startLoader(this.lm);
    if(this.userType==='user'){
        this.groupService.joinGroup(this.groupname);

        this.loaded = true;
      //  this.feedbackService.stopLoader();

      this.conn2 = this.groupService.checkIfComplete().subscribe((data)=>{
          if(data){
            this.completed = true;

          }

        }
      )
      this.initForm();
    }else if (this.userType == 'admin'){
    //  console.log(this.groupcode)
        this.groupService.joinGroup(this.groupname);
        this.loaded = true;
      //  this.feedbackService.stopLoader();
        this.initForm();
  }else{
    Geolocation.getCurrentPosition()
        .then((location) => {
        //When creating a group
          let address:Location = new Location(location.coords.latitude, location.coords.longitude);
              console.log("fired")
                this.group = new Group(this.groupname, this.username,this.totalBillAmount, address, false, this.groupcode, [this.username]);
                this.afService.setGroup(this.group, this.groupname);
                this.groupService.joinGroup(this.groupname);
                this.loaded = true;
              //  this.feedbackService.stopLoader();
                this.initForm();

            }//End Location
        ).catch((error) => {
        console.log('Error getting location', error);
      });
  }

this.loadReceipt();

console.log(this.connections)
}
loadReceipt(){

  this.afService.getUser(this.username, this.groupname);//binds to firebase groups,
  //console.log(this.groupname)
  //which is updated in the group service, when the socket is emitted to the server
  if(this.receiptExists() != undefined){
    let loadfirebase = this.afService.getUsers(this.groupname).subscribe(
      (data)=>{
        for(let i = 0; i < data.length; i++){
          let userInfo = new UserAmount(data[i].userAmount,data[i].username, data[i].groupname);
            this.allUsers.push(userInfo);
        }
        //this.allUsers = allUsers;
        //console.log(this.allUsers)
        this.updateView();
        loadfirebase.unsubscribe()
      }
  );
}
  this.conn = this.groupService.getItems().subscribe((data) => {
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
        .push(new FormControl({'value':null, 'disabled':this.completed}))//Explicitly cast to FormArray, as typscript doesn't know it should be an array
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

private setUserComlpeted(){
  this.groupForm.get('items').disable();
}
private onCompleted(){
    this.completed = true;
    this.groupForm.get('items').disable();
    this.afService.setGroupComplete(this.groupname, this.completed);
    this.groupService.disconnectUsers(this.groupname);
}
public deleteReceipt(){
  this.afService.deleteReceipt(this.groupname);
  this.navCtrl.popToRoot();
}
ngOnDestroy(){
this.connections.push(this.conn, this.conn2, this.conn3);
console.log(this.connections)
this.connections.forEach((conn)=>{
    conn.unsubscribe();
})


  }
}
