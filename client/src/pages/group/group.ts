import { Component, OnInit } from '@angular/core';
import { NavParams, LoadingController } from 'ionic-angular';

import { AdminService } from '../../services/admin.service';
import { UserAmount } from '../../models/userAmount.model';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage implements OnInit {
  private groupForm: FormGroup;
  private connection: any;
  private connection2: any;
  private connection3: any;
  private totalBillAmount: number;
  private currBillAmount: number;
  private userAmountTotal:number;
  private userAmount:number;
  private allUsersTotal: UserAmount[] = [];
  private groupname: string;
  private username:string;
  private userType:string;
  private loading:any;
  private loaded:boolean;
  data:any;

  constructor(private adminService: AdminService,
              private navParams: NavParams,
              private loadingCtrl: LoadingController) {

     this.totalBillAmount = this.currBillAmount = parseInt(navParams.get('totalBillAmount'));
     this.groupname = navParams.get('groupname');
     this.username = navParams.get('username');
     this.userType = navParams.get('userType');
     this.userAmountTotal = 0;
    // console.log(this.username)

   }

  ngOnInit() {
    this.loaded = false;
    this.loader();
    if(this.userType==='user'){
    this.adminService.joinGroup(this.groupname);
    this.loaded = true;
    this.loading.dismiss();
    this.initForm();

      }else{
      this.adminService.setGroup(this.totalBillAmount,this.groupname);

      this.connection2 =  this.adminService.getAddress().subscribe(adminAddress=> {
        this.adminService.joinGroup(this.groupname);
          //console.log(adminAddress)
          this.loaded = true;
          this.loading.dismiss();
          this.initForm();
          if(adminAddress){
          this.connection3 =  this.adminService.sendData(adminAddress).subscribe(data=> {
              this.connection2.unsubscribe(
                data => console.log(data),
                (err) => console.log(err));
              this.loaded = true;
              this.loading.dismiss();
              this.initForm();

              console.log(this.loaded)
          },(err) => console.log(err)); // Reach here if fails)
        }
      })

  }
this.loadReceipt();

}
loadReceipt(){
  this.connection = this.adminService.getItems().subscribe((data) => {
      this.currBillAmount  = this.totalBillAmount;
      this.userAmountTotal = 0;
      this.data = data;
      this.userAmount = parseInt(this.data.userAmount);
  let userInfo = new UserAmount(this.data.userAmount,this.data.username)
  let found = this.userExists(this.data.username, this.allUsersTotal);
  //Uses an array to keep track of totals
     /* If this user found in array, find index and replace
     if not found, push */
  if(found){
      for(let i = 0; i < this.allUsersTotal.length; i++){
          if(this.allUsersTotal[i].username === this.data.username){
                this.allUsersTotal[i] = userInfo;
          }
        }
      }else{
        this.allUsersTotal.push(userInfo);
    }
      console.log(this.allUsersTotal)
    for(let i = 0; i < this.allUsersTotal.length; i++){
         this.userAmountTotal = this.userAmountTotal + parseInt(this.allUsersTotal[i].userAmount);
      }

        this.currBillAmount  = (this.currBillAmount) - this.userAmountTotal;

  })
}

loader(){
  this.loading = this.loadingCtrl.create({
    content: "Please wait..."
  });
  this.loading.present();

}

  userExists(username, arr) {
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

  calculateItems(){
    this.userAmount = this.userAmount || 0;
    let fArray: FormArray = <FormArray>this.groupForm.get('items');
    const len = fArray.length;
    let itemAmount: number = this.groupForm.get('items').value;

    this.userAmount = 0;
    for(let i =0; i < len; i++ ){
      this.userAmount += +itemAmount[i];

  }

    this.adminService.upDateItems( this.totalBillAmount, this.groupname, this.userAmount, this.username);

  }
  ngOnDestroy(){
   this.connection.unsubscribe();
   this.connection2.unsubscribe();
   this.connection3.unsubscribe();
  }
}
