import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cgu',
  templateUrl: './cgu.page.html',
  styleUrls: ['./cgu.page.scss'],
})
export class CguPage implements OnInit {

  constructor(private navCtrl : NavController) { }

  ngOnInit() {
  }

  retour(){
    this.navCtrl.back();
  }

}
