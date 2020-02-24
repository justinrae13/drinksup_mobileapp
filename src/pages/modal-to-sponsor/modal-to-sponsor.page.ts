import { ModalController, ToastController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Component } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-to-sponsor',
  templateUrl: './modal-to-sponsor.page.html',
  styleUrls: ['./modal-to-sponsor.page.scss'],
})
export class ModalToSponsorPage{
  code : string = null;
  constructor(private toastCtrl : ToastController, private navParam : NavParams, private modalCtrl : ModalController, private clipboard: Clipboard, private socialSharing: SocialSharing) { }

  ionViewWillEnter() {
    this.code = this.navParam.get('codeParam');
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  copyMyCode(){
    this.clipboard.copy(this.code);
    this.sendNotification("Copié !");
    this.closeModal();
  }

  toSponsor(){
    let message = "Télécharger Drinks Up dès maintenant ! \n\n Android : https://play.google.com/store/apps/details?id=ch.drinksup.app \n IOS : https://apps.apple.com/fr/app/drinks-up/id1485176588 \n\nN'oublies pas de saisir mon code via l'appli : "+this.code+"\n\nTu peux soit copier le message en entier ou copier juste le code et le coller dans la section \"As-tu un code?\".";
    let subject = "Drinks Up application mobile (Android/IOS)";

    this.socialSharing.share(message,subject,null,null).then((data) => {
    }).catch((error) => {
      console.log(error);
    });
  }


  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
  }

}
