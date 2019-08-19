import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss'],
})
export class ParrainagePage implements OnInit {

  constructor(private navCtrl : NavController) { }

  ngOnInit() {
  }

  retour(){
    this.navCtrl.back();
  }

}
