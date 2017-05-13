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
  private conn4: any;
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
  private action:string;
  private oldAmount:number = 0;
  private groupCount:number;
  private isNegative:boolean = false;
  //private isRejoining:boolean = false;
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
     this.action = navParams.get('action');

     console.log(this.isNegative)

   }

ngOnInit() {

   console.log(this.userType, this.action)
    this.loaded = false;
    //
    if(this.userType==='user'){
        this.groupService.joinGroup(this.groupname);
        this.loaded = true;
      this.conn2 = this.groupService.checkIfComplete().subscribe((data)=>{
          if(data){
            this.completed = true;
            this.setUserComlpeted()
          }
        }
      )
      this.initForm();
    }else if (this.userType == 'admin' && this.action == "create_group"){
      this.feedbackService.startLoader("Creating Group, please wait...");
      this.conn4 = this.groupService.createGroup(this.groupname, this.username, this.totalBillAmount, this.groupcode)
      .then((group)=>{
        if(group){
          console.log(group)
          this.loaded = true;
          this.initForm();
          this.feedbackService.stopLoader();
        }
      })

  }else if (this.userType == 'admin'){
        this.groupService.joinGroup(this.groupname);
        this.loaded = true;
        this.initForm();
  }
this.loadReceipt();

}
loadReceipt(){

  this.afService.getUser(this.username, this.groupname);
  //Downloads totals (what's been paid so far) from firebase, only once; when coming back to the page
  if(this.receiptExists() != undefined){

    let loadfirebase = this.afService.getOldAmounts(this.groupname).subscribe(
      (data)=>{
        for(let i = 0; i < data.length; i++){
          let userInfo = new UserAmount(data[i].userAmount, data[i].username, data[i].groupname);
            if(this.username == data[i].username){//Get the previous amount fo this user and put into var
              this.oldAmount = data[i].userAmount;//This will make sure that the amount in the db is added to rather than overwritten
            }
            this.allUsers.push(userInfo);//Push all od amounts to array and udate the view
        }
        this.updateView();
        loadfirebase.unsubscribe()
      }
  );
  //This pushed the username to the group array and updates the groupmembers field held in the groups db
  this.conn3 = this.afService.checkifInGroup(this.groupname)
  .subscribe((data)=>{
    if(data.groupmembers!= undefined){
     for( let i = 0; i < data.groupmembers.length; i++){
       this.groupmembers = data.groupmembers.slice();
     }
     if(this.groupmembers.indexOf(this.username) === -1){
         this.groupmembers.push(this.username)
     }
      this.afService.updateGroupmembers(this.groupname, this.groupmembers)
      .then((data)=>{
      //  this.groupCount++;
        //console.log(this.groupmembers)
      })
    }
  })
}
//Subscribe to get user info as it updates and push to array
  this.conn = this.groupService.getItems().subscribe((data) => {
    console.log(data)
      this.currBillAmount = this.totalBillAmount;
      this.userAmountTotal = 0;
      this.data = data;
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
         if(this.allUsers[i].username === this.username){
           this.userAmount = parseInt(this.allUsers[i].userAmount);

         }
      }
      this.currBillAmount  = (this.currBillAmount) - this.userAmountTotal;
      if(this.currBillAmount < 0){this.isNegative = true}else{this.isNegative = false}
}

private receiptExists(){
    return this.afService.getOldAmounts(this.groupname)//Get all user amounts from db
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
//Put oldAmount into sent function, oldAmount is instatiated as 0, so is ok if not used
    this.groupService.upDateItems(this.totalBillAmount, this.groupname, this.userAmount + this.oldAmount, this.username);
}

private setUserComlpeted(){
  this.groupForm.get('items').disable();
  this.feedbackService.alertUser( "Completing Receipt", "The Administrator is setting this group receipt to completed<br /> All editing will stop", "OK" ,this.navCtrl.popToRoot())
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
this.connections.push(this.conn, this.conn2, this.conn3, this.conn4);
this.connections.forEach((conn)=>{
  if(conn!=undefined){
    conn.unsubscribe();
  }
})


  }
}
