import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AdminService } from '../../services/admin.service';
import { GroupPage } from '../group/group';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage implements OnInit {
  private errorTxt:string = '';
  constructor(private adminService: AdminService, private navCtrl: NavController) {  }
  ngOnInit() {}

  setGroup(f:NgForm){
    let form = f.value
        if(form.groupcode.length == 4){
          this.errorTxt = ""
          this.navCtrl.push(GroupPage, {totalBillAmount: form.totalBillAmount, groupname:form.groupname, groupcode:form.groupcode, completed: false, userType: "admin", action: "create_group"});
          f.reset();
        }else{
          this.errorTxt = "There needs to be four (4) numbers"
        }
  
  }
}
