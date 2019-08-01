import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

@Component({
  selector: 'app-tabsadmin',
  templateUrl: './tabsadmin.page.html',
  styleUrls: ['./tabsadmin.page.scss'],
})
export class TabsadminPage implements OnInit {

  constructor(public alertController: AlertController,public navCtrl : NavController, public storage: Storage, private googlePlus : GooglePlus) { }

  ngOnInit() {
  }


  async logoutadmin() {
    const alert = await this.alertController.create({
      header: "Confirmation",
      message: "<h3>Êtes-vous sûr de vouloir se déloguer ? </h3>",
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
                this.googlePlus.logout().then(res => {console.log(res);}).catch(err => console.error(err));
                this.navCtrl.navigateRoot('login');
              }
          }
      ]
  });

  await alert.present();
 }

}
