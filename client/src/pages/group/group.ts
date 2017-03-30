import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
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
  private totalBillAmount: number;
  private currBillAmount: number;
  private userAmountTotal:number;
  private userAmount:number;
  private userAmountArr: UserAmount[] = [];
  private groupname: string;
  private username:string;
  private userType:string;
  data:any;

  constructor(private adminService: AdminService, private navParams: NavParams) {
     this.totalBillAmount = this.currBillAmount = parseInt(navParams.get('totalBillAmount'));
     this.groupname = navParams.get('groupname');
     this.username = navParams.get('username');
     this.userType = navParams.get('userType');
     this.userAmountTotal = 0;
    // console.log(this.username)

   }

  ngOnInit() {
    if(this.userType==='user'){
    this.adminService.joinGroup(this.groupname);
  }
    this.initForm();
    this.connection = this.adminService.getItems().subscribe((data) => {
        //Will need an if statment to match username, so will be able to extract correct data
        this.currBillAmount  = this.totalBillAmount;
        this.userAmountTotal = 0;
       //console.log(data);
        this.data = data;

        if(this.currBillAmount > this.data.currBillAmount){
          this.currBillAmount = parseInt(this.data.currBillAmount);
        }else{
          this.currBillAmount = this.currBillAmount;
        }


        this.userAmount = parseInt(this.data.userAmount);
        //console.log(this.userAmountArr)
       let userInfo = new UserAmount(this.data.userAmount,this.data.username)

  let found = this.userExists(this.data.username, this.userAmountArr);
  //let selectedCategory = this.userAmountArr.filter(username => this.userAmountArr[0].username === this.data.username)[0];

  if(found){
      for(let i = 0; i < this.userAmountArr.length; i++){
          if(this.userAmountArr[i].username === this.data.username){
           //console.log(this.userAmountArr[i])
                this.userAmountArr[i] = userInfo;
          }
        }
      }else{
        this.userAmountArr.push(userInfo);
      }


      for(let i = 0; i < this.userAmountArr.length; i++){
          if(this.userAmountArr[i].username !== this.data.username){
           this.userAmountTotal = this.userAmountTotal + parseInt(this.userAmountArr[i].userAmount);
           console.log(this.userAmountTotal)
          }
        }

          this.currBillAmount  = (this.currBillAmount  - this.userAmount) - this.userAmountTotal;
 //console.log(this.userAmountArr)
  })
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
    //let total:number = 0;
    //Take userAmount sent back from socket and add back to current bill amount
    this.currBillAmount  = this.totalBillAmount;

    this.userAmount = 0;
    for(let i =0; i < len; i++ ){
      this.userAmount += +itemAmount[i];

  }

    //this.currBillAmount  = (this.currBillAmount  - this.userAmount) - this.userAmountTotal;
  //console.log("currBillAmount= "+this.currBillAmount)
  //console.log("userAmountTotal= "+this.userAmountTotal)
  //  console.log(this.userAmount)
    this.adminService.upDateItems(this.currBillAmount, this.totalBillAmount, this.groupname, this.userAmount, this.username);

  }
  ngOnDestroy(){
   this.connection.unsubscribe();
  }
}
