import { Injectable, OnInit } from '@angular/core';
// import * as io from 'socket.io-client';
import { AlertController, LoadingController} from 'ionic-angular';
import { Group } from '../models/group.model';
import { StartPage  } from '../pages/start/start';
import { HaversineService, GeoCoord} from "ng2-haversine";

import { Location } from '../models/location.model';
import { AfService } from '../services/af.service';
import { UserInfo } from '../models/userAmount.model';
import { Geolocation } from 'ionic-native';
import { FeedbackService } from './feedback.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
@Injectable()
export class UserService {
  public userAddress: GeoCoord;
  private loading:any;
  public emitUsername = new BehaviorSubject<string>(null);
  private prompt:any;
  constructor(private alertCtrl: AlertController,
              private _af:AngularFire,
              private loadingCtrl: LoadingController,
              private afService:AfService,
              private hsService: HaversineService,
              private FeedbackService: FeedbackService) {}
  //
  public checkUserName(){
    if (localStorage.getItem('nickname') === null){
      return;
      }
        this.emitUsername.next(localStorage.getItem('nickname'))
   }


  public setUserName(){
    let dbUpdated:boolean = false;
    this.prompt = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: 'Please enter your name/nickname that you would like to use',
      message:'This will only be shared with group members',
      inputs: [
        {
          name: 'nickname',
          placeholder: 'Name'
        }
      ],
      buttons: [
        {
          text: 'Use this',
          handler: (data) => {
              if(data.nickname.trim() =='' || data.nickname == null){
                  this.setUserName();
                }else{
                  this.prompt.data.message = "Checking...."
                  this.afService.checkIfUserNameExist(data.nickname.trim())
                    .subscribe((user)=>{
                        if(user.username === undefined){
                          console.log(user.username);
                          this.afService.createUser(data.nickname.trim());
                          localStorage.setItem('nickname', data.nickname);
                          this.emitUsername.next(data.nickname);
                          dbUpdated = true;
                          this.prompt.dismiss()
                        }else if(user.username !== undefined && !dbUpdated){
                          console.log(user.username)
                          this.prompt.data.message = 'This username is already taken please use another';
                          dbUpdated = false;
                        }
                    })
              return false;
              }
            }
         }
      ]
  });
  this.prompt.present();

}



  public getUserName(){
    return localStorage.getItem('nickname')
  }

  public getGroupcode(titleTxt, groupcode,gotoPage){
      let alert = this.alertCtrl.create({
        enableBackdropDismiss: false,
        title: titleTxt,
        inputs: [{
              name: 'groupcode',
              placeholder: 'Groupcode',
              type: 'number'
              }],
        buttons:[{
            text: 'Send Code',
              handler: (data) => {
                //console.log(data.groupname, groupname)
                if(data.groupcode == groupcode){
                  alert.dismiss().then(() => {
                  gotoPage
                  });
                }else{
                  data.groupname ='';
                  titleTxt = "There has been an issue with your groupcode please try again"
                }
              }
            }
          ]
      });
    alert.present();
  }

  private startLoader(txt){
    this.loading = this.loadingCtrl.create({
      content: txt
    });
    this.loading.present();
  }
 private stopLoader(){
   this.prompt.dismiss();
   this.loading.dismiss();
 }

}
