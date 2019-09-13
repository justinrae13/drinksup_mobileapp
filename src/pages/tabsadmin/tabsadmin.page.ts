import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

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


  constructor(private fb: Facebook, public alertController: AlertController,public navCtrl : NavController, public storage: Storage, private googlePlus : GooglePlus) { }

  ngOnInit() {
  }

  ionViewDidEnter(){    
    this.c_o_o_t_z = "0";
    setTimeout(() => {
      this.c_d_o_t_z = "none";
    }, 500);
  }

  animate(){
    this.goLeft = "translateX(-70px)";
    this.goRight = "translateX(70px)";
    this.fadeOut = "0";
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
