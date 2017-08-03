import { Component, OnInit } from '@angular/core';
import { NavParams, NavController} from 'ionic-angular';

import { AfService } from '../../services/af.service';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { FeedbackService } from '../../services/feedback.service';



import  'rxjs/Rx';

@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage implements OnInit {
  // private groupForm: FormGroup;
  private connections:Array<any> = [];
  private totalBillAmount: number;
  // private previous:string;
  private groupname: string;
  private username:string;
  private userType:string;
  private loaded:boolean;

  private completed:boolean;
  private groupcode:number;
  private action:string;
  private joining_group:boolean;
  public initTotals = {};
  private loadForm = {};
  constructor(private navParams: NavParams,
              private afService:AfService,
              private groupService: GroupService,
              private userService: UserService,
              private feedbackService: FeedbackService,
              private navCtrl: NavController){}

  ngOnInit() {
    this.username = this.userService.getUserName();
    this.groupname = this.navParams.get('groupname');
    this.action = this.navParams.get('action');
    this.joining_group = this.navParams.get('joining_group');
    // this.previous = this.navParams.get('previous');
    this.userType = this.navParams.get('userType');
    this.totalBillAmount = this.navParams.get('totalBillAmount');
    this.groupcode = this.navParams.get('groupcode');
    this.completed = this.navParams.get('completed');
    this.loaded = false;
      // console.log(this.previous)
    this.initTotals = { groupname: this.groupname, username: this.username, totalBillAmount: this.totalBillAmount }
    this.loadForm = { groupname: this.groupname, username: this.username, joining_group: this.joining_group, userType: this.userType, completed: this.completed }//, previous: this.previous
    var conn;
      if(this.userType==='user'){
                this.feedbackService.startLoader("Loading Group, please wait...");
              //Adds groupmember if not already done
              conn = this.afService.updateGroupmembers(this.groupname, this.username)
                      .subscribe((data)=>{
                          this.loaded = true;
                          this.feedbackService.stopLoader();
                        // console.log(data)
                      })
                     this.connections.push(conn);
                }else if (this.userType == 'admin' && this.action == "create_group"){
                  this.feedbackService.startLoader("Creating Group, please wait...");
                  // console.log(this.groupname, this.username, this.totalBillAmount, this.groupcode)
                    conn = this.groupService.createGroup(this.groupname, this.username, this.totalBillAmount, this.groupcode)
                        .then((group)=>{
                              if(group){
                                // console.log(group)
                                  this.loaded = true;
                                  this.feedbackService.stopLoader();
                                }
                        })
                        // this.connections.push(conn)
                    }else if (this.userType == 'admin'){//&&  this.action == "editing" || this.userType == 'admin'
                      this.loaded = true;
                  }
    }



    ionViewDidLeave(){
      for(let i = 0; i < this.connections.length; i++){
        if(this.connections[i] != undefined){
          this.connections[i].unsubscribe();
        }
      }
    }
}
