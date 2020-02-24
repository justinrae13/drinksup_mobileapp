import { ModalController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Component } from '@angular/core';


@Component({
  selector: 'app-modal-to-share',
  templateUrl: './modal-to-share.page.html',
  styleUrls: ['./modal-to-share.page.scss'],
})
export class ModalToSharePage {

  constructor(private modalCtrl : ModalController, private socialSharing: SocialSharing) { }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  toShare(){
    let message = "Télécharger Drinks Up dès maintenant ! \n\n Android : https://play.google.com/store/apps/details?id=ch.drinksup.app \n IOS : https://apps.apple.com/fr/app/drinks-up/id1485176588";
    let subject = "Drinks Up application mobile (Android/IOS)";

    this.socialSharing.share(message,subject,null,null).then((data) => {
    }).catch((error) => {
      console.log(error);
    });
  }


}
