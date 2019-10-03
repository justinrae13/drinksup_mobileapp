import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Events } from '@ionic/angular';
import { AborenewService } from '../../app/service/aborenew.service';

@Component({
  selector: 'app-tabsadmin',
  templateUrl: './tabsadmin.page.html',
  styleUrls: ['./tabsadmin.page.scss'],
})
export class TabsadminPage implements OnInit {
  c_o_o_t_z : string = "1";
  c_d_o_t_z : string = "flex";

  goLeft : string = "translateX(0px)";
  goRight : string = "translateX(0px)";
  fadeOut : string = "1";


  constructor(private events : Events, private aborenew : AborenewService, private fb: Facebook, public alertController: AlertController,public navCtrl : NavController, public storage: Storage, private googlePlus : GooglePlus) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.events.publish("wentThroughLogin");
  }

  ionViewDidEnter(){
    if(!this.aborenew.wentThroughLoginPage){
      this.animate();
    }else{
      this.c_d_o_t_z = "none";
    }
  }

  animate(){
    setTimeout(() => {
      this.goLeft = "translateX(-70px)";
      this.goRight = "translateX(70px)";
      this.fadeOut = "0";
    }, 300);
    setTimeout(() => {
      this.c_o_o_t_z = "0"; 
    }, 1000);
    setTimeout(() => {
      this.c_d_o_t_z = "none";
    }, 1550);
  }


  async logoutadmin() {
    const alert = await this.alertController.create({
      header: "Confirmation",
      message: "<h3>Êtes-vous sûr de vouloir se déconnecter ? </h3>",
      cssClass : "dimBackdropAlert",
      buttons: [
          {
              text: 'Non',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
          }, {
              text: 'Oui',
              handler: () => {
                this.storage.remove("SessionInKey");
                this.storage.remove("SessionRoleKey");
                this.storage.remove("SessionEmailKey");
                this.storage.remove("SessionIdKey");
                this.storage.remove("firstLogin");

                this.googlePlus.logout().then(res => {console.log(res);}).catch(err => console.error(err));
                this.navCtrl.navigateRoot('login');
                this.fb.logout();
              }
          }
      ]
  });

  await alert.present();
 }

}
