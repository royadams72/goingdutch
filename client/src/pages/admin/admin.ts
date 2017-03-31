import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminService } from '../../services/admin.service';
import { GroupPage } from '../group/group';
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage implements OnInit {
  constructor(private adminService: AdminService, private navCtrl: NavController) {  }
  groupname:string;
  totalBillAmount:number;
  username:string;
  ngOnInit() {}

  setGroup(){
    //this.adminService.setGroup(this.totalBillAmount, this.groupname);
    this.navCtrl.push(GroupPage, {totalBillAmount: this.totalBillAmount, groupname:this.groupname, username: this.username});
    //console.log(this.billAmount,this.groupname)
  }
}
