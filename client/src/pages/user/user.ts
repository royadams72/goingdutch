import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminService } from '../../services/admin.service';
import { GroupPage } from '../group/group';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage implements OnInit {
  constructor(private adminService: AdminService, private navCtrl: NavController) {  }
  groupname:string;
  totalBillAmount:number
  ngOnInit() {}

  setGroup(){
    this.adminService.joinGroup();
    this.navCtrl.push(GroupPage, {totalBillAmount: this.totalBillAmount, groupname:this.groupname});
    //console.log(this.billAmount,this.groupname)
  }
}
