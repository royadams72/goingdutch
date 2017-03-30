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
  private connection1: any;
  private connection2: any;
  private connArray: Array<any> = [];
  private data: any;
  public groups: any = [];
  private n:number = Math.round(Math.random() * (100 - 50));
          num = this.n.toString()
  private username = "TestUser"+this.num;

  ngOnInit() {
      //console.log("Fired")
    this.connection1 = this.userService.getInvites().subscribe((data) => {
      this.data = data
       this.userService.setUser(this.data.totalBillAmount, this.data.groupname, this.data.address)
              this.connection1 =  this.userService.getAddress().subscribe(userAddress=> {
                //console.log(this.data.address)
          //userAddress = "209 Grange Rd, London E13 0HB";
                if(userAddress==this.data.address){
                  this.groups.push(this.data);
                  console.log(this.groups)
                }
              })


  })

  this.connArray.push(this.connection1, this.connection2)
}
  joinGroup(){


      this.navCtrl.push(GroupPage, {totalBillAmount: this.data.totalBillAmount, groupname:this.data.groupname, username: this.username, userType: "user"});

  }
  ngOnDestroy(){
    console.log("unsubscribed")
    for(let i = 0; i < this.connArray.length; i++){
      this.connArray[i].unsubscribe()
    }
  // this.connection.unsubscribe();
  }
}
