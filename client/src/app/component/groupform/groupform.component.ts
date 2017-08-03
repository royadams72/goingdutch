import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { NavController, AlertController} from 'ionic-angular';
import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UserInfo } from '../../../models/userAmount.model';
import { Group } from '../../../models/group.model'
import { Items } from '../../../models/items.interface';
import { AfService } from '../../../services/af.service';
import { FeedbackService } from '../../../services/feedback.service';
import { GroupAdminPage } from '../../../pages/groupadmin/groupadmin';
import { JoinGroupPage } from '../../../pages/joingroup/joingroup';
import 'rxjs/Rx';

@Component({
  selector: 'app-groupform',
  templateUrl: 'groupform.component.html'
})
export class GroupFormComponent implements OnInit, OnDestroy{
  @Input() formDataObj;//This is binding to a property
  private totalBillAmount: number;
  private groupname: string;
  private username:string;
  private group:Group;
  private completed:boolean;
  private groupForm: FormGroup;
  private action:string;
  private joining_group:boolean;
  private userType:string;
  private conn:any;
  private connections:Array<any> = [];
  private userInGroup:boolean;
  private loaded:boolean = false;
  private formDisabled:boolean = false;
  constructor(private groupService: GroupService,
              private userService: UserService,
              private _fb: FormBuilder,
              private afService:AfService,
              private navCtrl: NavController,
              private feedbackService: FeedbackService,
              private alertCtrl: AlertController) {}

  ngOnInit(){
    // this.previous = this.formDataObj.previous;
    this.username = this.formDataObj.username;
    this.groupname = this.formDataObj.groupname;
    this.action = this.formDataObj.action;
    this.joining_group = this.formDataObj.joining_group;
    this.userType = this.formDataObj.userType;
    this.groupForm = this._fb.group({
        items: this._fb.array([])
      });
    this.conn = this.groupService.getGroupInfo(this.groupname , this.username)
      .subscribe(res=>{
        //If previous not null then viewing previous groups. Make sure you can't edit
        //By setting completed to true
         this.completed = res[0].completed;
        if(this.userType == 'user' && this.completed && this.joining_group ){
              this.setUserComlpeted();
          }
        if(!this.loaded){
          this.loaded = true;
          //Empty form array
          this.groupForm.controls['items'] = this._fb.array([])
            if (res){
              this.group = res[0];
              //Check if this user is in group
              res[1].filter(group=>{
                    if(this.username === group.username){
                      this.userInGroup = true;
                    }
                })
                  if(this.action === 'create_group' || res[1].length === 0 || !this.userInGroup){
                      this.addFormFeilds();
                    }else if (this.userInGroup){
                        res[1].filter(g=>{
                            if(this.username === g.username){
                              this.addFormFeilds(g.items);
                            }
                        })
                    }
                }
          }

      })
  this.connections.push(this.conn)
    }

  private addFormFeilds(obj?:any){
      if(obj !== undefined){
          for (var i in obj) {
            (<FormArray>this.groupForm.controls['items'])
              .push(this._fb.group({
                  item: [{value: obj[i].item, disabled: this.completed}],
                  itemAmount: [{value:obj[i].itemAmount == 0 ? obj[i].itemAmount = '' : obj[i].itemAmount = obj[i].itemAmount, disabled: this.completed}]
                }))//Explicitly cast to FormArray, as typscript doesn't know it should be an array
              }
        }else{
          for(let i = 0; i < 5; i++){
             (<FormArray>this.groupForm.controls['items'])
              .push(this._fb.group({
                  item: [{value: '', disabled: this.completed}],
                  itemAmount: [{value: '', disabled: this.completed}]
              }))//Explicitly cast to FormArray, as typscript doesn't know it should be an array
            }
        }
    }

    private updateItems(){
      //Updates DB with info from feilds
      let items:Items[] = [];
      let userTotal = 0;
      const len = this.groupForm.controls['items'].value.length;
        for(let i =0; i < len; i++ ){
          let item = this.groupForm.controls['items'].value[i].item;
          let itemAmount = +this.groupForm.controls['items'].value[i].itemAmount;
              userTotal += itemAmount;
              items.push({item, itemAmount})
        }
          this.groupService.upDateItems(this.totalBillAmount, this.groupname, userTotal, items, this.username);
    }

  public deleteReceipt(){
    var conn =  this.afService.deleteReceipt(this.groupname, this.username)
        .subscribe(data=>{
          if(data){
            this.navCtrl.setRoot(JoinGroupPage, {completed:false});
          }
        });
        this.connections.push(conn)
  }

  private onCompleted(){
      let alert = this.alertCtrl.create({
        title: "Set Group Completed",
        message: "Are you sure you want to set this group receipt complete?",
        buttons:[ {
            text: 'yes',
              handler: () => {
                this.formDisabled = true;
                this.afService.setGroupComplete(this.groupname, true);
                alert.dismiss().then(() => {this.navCtrl.setRoot(JoinGroupPage, {completed:false})});
              }
            },
            {
                text: 'Cancel',
                  handler: () => {
                    return
                  }
                }
          ]
      });
      alert.present();
  }

  private onEdit(){
    this.navCtrl.push(GroupAdminPage, {editing: true, groupname: this.groupname})
  }
  private setUserComlpeted(){

    let txt: string = "The Administrator is setting this group receipt to completed all editing will stop<br /> You can view previous groups, via the previous groups button"
    let alert = this.alertCtrl.create({
      title: "Group is Being Set to Completed",
      message: txt,
      buttons:[ {
          text: 'OK',
            handler: () => {
                  alert.dismiss().then(() => {this.navCtrl.setRoot(JoinGroupPage, {completed:false})});
            }
          }
        ]
    });

    alert.present();
  }

  ngOnDestroy(){
    console.log('ngOnDestroy')
    for(let i = 0; i < this.connections.length; i++){
      if(this.connections[i] != undefined){
          this.connections[i].unsubscribe();
      }
    }
  }
}
