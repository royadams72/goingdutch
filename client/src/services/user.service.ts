import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AlertController} from 'ionic-angular';
import { Group } from '../models/group.model';
import { StartPage  } from '../pages/start/start';

@Injectable()
export class UserService {


  constructor(private alertCtrl: AlertController) {}

  public checkUserName(){
    if (localStorage.getItem('nickname')==null){
        this.setUserName();
      }else{
        return false;
    }
     console.log(localStorage.getItem('nickname'))
}

  private setUserName(){
    let prompt = this.alertCtrl.create({
      title: 'Please enter your name',
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

                return;
              }
              console.log(data.nickname)
              localStorage.setItem('nickname', data.nickname);
            }

        }
      ]
  });
  prompt.present();

}


  getUserName(){
    return localStorage.getItem('nickname')
  }



}
