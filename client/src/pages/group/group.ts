import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { AdminService } from '../../services/admin.service';
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
  private total:number;
  private userAmount:number;
  private groupname: string;
  data:any;

  constructor(private adminService: AdminService, private navParams: NavParams) {
     this.totalBillAmount = this.currBillAmount = parseInt(navParams.get('totalBillAmount'));
     this.groupname = navParams.get('groupname');


   }

  ngOnInit() {

    this.initForm();
    this.connection = this.adminService.getItems().subscribe((data) => {
        //this.messages.push(message);
        this.data = data
        this.currBillAmount = parseInt(this.data.currBillAmount);
        this.userAmount = parseInt(this.data.userAmount);
      console.log(this.currBillAmount)
    //  this.billAmount = this.data.billAmount;
  //   console.log("billAmount in ngOnInit "+this.billAmount)
       //console.log(this.data.billAmount, this.billAmount);
      //  this.billAmount = this.data.billAmount
        //  console.log(this.data.billAmount, this.billAmount);

      //})
    //this.calculateItems();
  })
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
    let fArray: FormArray = <FormArray>this.groupForm.get('items');
    const len = fArray.length;
    let itemAmount: number = this.groupForm.get('items').value;
    let total:number = 0;
    let userAmount

     this.userAmount = this.userAmount || 0;

  console.log("this.userAmount in calculateItems "+this.userAmount)
  //  this.currBillAmount + userAmount;
    let amount = this.currBillAmount + this.userAmount;
    this.userAmount = 0;
//amount - total;
    console.log("amount in calculateItems "+amount)
    for(let i =0; i < len; i++ ){

      this.userAmount += +itemAmount[i];



    }
    //this.currBillAmount = (this.currBillAmount - total);
//  console.log("this.currBillAmount= "+this.currBillAmount, this.userAmount)
   //console.log("billAmount in calculateItems "+this.billAmount)
     amount = amount - this.userAmount;
     console.log(amount)
    this.adminService.upDateItems(amount, this.totalBillAmount,this.groupname, this.userAmount);
    //this.billAmount = amount;

  //  console.log(this.groupForm.get('items').value.length)
  }
  ngOnDestroy(){
   this.connection.unsubscribe();
  }
}
