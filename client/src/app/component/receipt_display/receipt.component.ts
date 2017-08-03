import { Component, Input, OnInit, OnDestroy} from '@angular/core';


import { GroupService } from '../../../services/group.service';
import { UserService } from '../../../services/user.service';

// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';




import 'rxjs/Rx';
@Component({
  selector: 'app-receiptdisplay',
  templateUrl: 'receiptComponent.html'
})
export class ReceiptComponent implements OnInit, OnDestroy {
@Input() dataObj;//This is binding to a property
  private billRemaining: number;
  private userAmountTotal:number;
  private userAmount:number;
  private username:string;

  private isNegative:boolean = false;
  private conn:any;
  constructor(private groupService: GroupService, private userService: UserService) {}

  ngOnInit(){
      let user;
      let userTotal;
      this.username = this.dataObj.username;
      let groupname = this.dataObj.groupname;
      this.conn = this.groupService.getGroupInfo( groupname, this.username )
          .subscribe((data)=>{
            let billRemaining = this.dataObj.totalBillAmount
            let userAmountTotal = 0;
            let userAmount =  0;
            // console.log(billRemaining)
              for(let i = 0; i < data[1].length; i++){
                   user = data[1][i];
                   userAmountTotal += parseFloat(user.userAmount);
                     if( user.username === this.username ){
                       userAmount = parseFloat(user.userAmount);
                      }
                      billRemaining  = (data[0].totalBillAmount) - userAmountTotal;
                      if(billRemaining < 0){this.isNegative = true}else{this.isNegative = false}
                }//
              this.billRemaining = billRemaining.toFixed(2);
              this.userAmountTotal = +userAmountTotal.toFixed(2);
              this.userAmount =  +userAmount.toFixed(2);
          })

      }


  ngOnDestroy(){
        this.conn.unsubscribe();
  }
}
