import { Component, OnInit } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';
import { AdminService } from '../../services/admin.service';
import { GroupPage } from '../group/group';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfService } from '../../services/af.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import  'rxjs/Rx';
@Component({
  selector: 'page-creategroup',
  templateUrl: 'groupadmin.html',
})
export class GroupAdminPage implements OnInit {
  private errorTxt:string = '';
  private gName = new BehaviorSubject<string>('');
  private tBill = new BehaviorSubject<number>(null);
  private nameTaken:boolean = false;
  private editing:boolean = false;
  private adminForm: FormGroup;
  private connections:Array<Subscription> = [];
  constructor(private adminService: AdminService,
              private navCtrl: NavController,
              private afService:AfService,
              private navParams: NavParams,
              private userService: UserService,
              private groupService: GroupService,
              private _fb: FormBuilder,) {  }
  ngOnInit() {

      //  console.log(this.navParams.get('editing'))
    if(this.navParams.get('editing')){
      // console.log(this.navParams.get('editing'))
        this.editing = this.navParams.get('editing');
        let groupname = this.navParams.get('groupname');
        let conn = this.groupService.getGroupInfo(groupname, this.userService.getUserName())
                  .subscribe(bill=>{
                    // console.log(bill)
                    this.addForm({totalBillAmount: bill[0].totalBillAmount, groupname: bill[0].groupname,  groupcode: bill[0].groupcode});
                  })

        let conn2 = this.groupService.updateTotalBill(groupname, this.tBill)
                  .subscribe(bill=>{console.log(bill)})
                      this.connections.push(conn, conn2)
                      }else{
                        this.addForm();
                        let conn =  this.afService.checkGroup(this.gName)
                          .subscribe((result)=> {
                            if( this.gName.getValue().trim() !== '' || this.gName.getValue().length > 0 ){
                              if( result.length !== 0 ){
                                // console.log(result)
                                  this.nameTaken = true;
                                }else{
                                  this.nameTaken = false;
                                }
                              }
                            })
      this.connections.push(conn)
    }
  }
public addForm(data?:any){
    // console.log(data.totalBillAmount)
  this.adminForm = this._fb.group({
      'totalBillAmount': [ data ? data.totalBillAmount : null, Validators.required],
      'groupname': [{ value:data ? data.groupname : null,  disabled: this.editing }, Validators.required],
      'groupcode': [{ value: data ? data.groupcode : null, disabled: this.editing }, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
    });
}
public setGroup(){
  // console.log('fired')
    let form = this.adminForm.getRawValue();
    let action:string;
    this.editing ? action = 'editing' : action = 'create_group'
    console.log(form.totalBillAmount)

      if(form.totalBillAmount === null || form.totalBillAmount.trim() === ''){
          this.errorTxt = "There needs to be numbers in Amount of Receipt field and it must not be empty";
        }else if(form.groupname === null){
            this.errorTxt = "Groupname field must not be empty";
          }else if(form.groupcode === null || form.groupcode.length !== 4){
                this.errorTxt = "There needs to be four (4) numbers for your code and field must not be empty"
              }else if(!this.nameTaken){
                  this.errorTxt = ""
              // Need getRawValue, to submit fields that are disabled, while in edit mode
                  this.navCtrl.push(GroupPage, {totalBillAmount: form.totalBillAmount.trim(), groupname:form.groupname, groupcode:form.groupcode, completed: false, userType: "admin", action: action});
                  this.adminForm.reset();
                  this.nameTaken = false;
                }
  }

  ionViewDidLeave(){
    for(let i = 0; i < this.connections.length; i++){
      this.connections[i].unsubscribe();
    }
  }
}
