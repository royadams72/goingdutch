import { Injectable } from '@angular/core';
import { LoadingController, AlertController} from 'ionic-angular';


@Injectable()
export class FeedbackService {
  private loading


  constructor(private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

   }
   public alertUser(title:string, message:string, btnText:string, url?:any){
     let alert = this.alertCtrl.create({
       title: title,
       message: message,
       buttons:[ {
           text: btnText,
             handler: (data) => {
               //console.log(data.groupname, groupname)
                     alert.dismiss().then(() => {
                       if(url){
                             url;
                           }
                     });

             }
           }
         ]
     });
     alert.present();
   }


   public startLoader(message:string){
    this.loading = this.loadingCtrl.create({
       content: message
     });
     this.loading.present();
   }

   public stopLoader(){
       this.loading.dismiss();
   }

   public showError(error:string) {
         let alert = this.alertCtrl.create({
           title: 'There has been a problem',
           message: error,
           buttons: ['OK']
         });
         alert.present();
     }



}
