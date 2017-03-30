import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from '../../services/user.service';
import { GroupPage } from '../group/group';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage implements OnInit {
  constructor(private userService: UserService, private navCtrl: NavController) {  }
  private totalBillAmount:number
  private connection: any;
  private data: any;
  public groups: any = [];
  private n:number = Math.round(Math.random() * (100 - 50));
          num = this.n.toString()
  private username = "TestUser"+this.num;

  ngOnInit() {
      //console.log("Fired")
    this.connection = this.userService.getInvites().subscribe((data) => {
          this.data = data
              this.groups.push(this.data)
      //  console.log(this.data)

  })

  }
  joinGroup(){


      this.navCtrl.push(GroupPage, {totalBillAmount: this.data.totalBillAmount, groupname:this.data.groupname, username: this.username, userType: "user"});

  }
  ngOnDestroy(){
    console.log("unsubscribed")
   this.connection.unsubscribe();
  }
}
