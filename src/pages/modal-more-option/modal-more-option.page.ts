import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-more-option',
  templateUrl: './modal-more-option.page.html',
  styleUrls: ['./modal-more-option.page.scss'],
})
export class ModalMoreOptionPage {

  constructor(private modalCtrl : ModalController) { }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  opt(role){
    this.modalCtrl.dismiss(role);
  }

}
