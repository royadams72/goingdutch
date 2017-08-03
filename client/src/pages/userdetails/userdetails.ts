import { Component, OnInit} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { Group } from '../../models/group.model'
/*
  Generated class for the Userdetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-userdetails',
  templateUrl: 'userdetails.html'
})
export class UserdetailsPage implements OnInit{
  private conn:any;
  private groupname: string;
  private username:string;
  private group:Group;
  private userDetails:Array<any> = [];
  private isNegative:boolean = false;
  public initTotals:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private groupService: GroupService,
              private userService: UserService) {
                this.username = this.navParams.get('username');
                this.groupname = this.navParams.get('groupname');
                this.initTotals = {groupname: this.groupname, username: this.username}
              }

  ngOnInit() {
    let thisGroup;
    // console.log(this.initObj)
      this.conn = this.groupService.getGroupInfo( this.groupname, this.username)
        .subscribe(res=>{
          if (res){
            this.userDetails = [];
            thisGroup = res[0];
            //Check if this user is in group
            for(let i = 0; i < res[1].length; i++){
                let data = res[1][i]
                // console.log(allUsers[i])
                if(this.userExists(this.username, [data])){
                    return  data.items.map((item)=>{
                        if(item.item.trim() !== '' || item.itemAmount !== 0){
                          this.userDetails.push(item);
                            // console.log(this.userDetails)
                        }

                      })
                }
            }
        }
    })
  }

  private userExists(username, arr) {
     return arr.some(function(el) {
       return el.username === username;
     });
   }
   ngOnDestroy(){
    this.conn.unsubscribe();    
   }

}
