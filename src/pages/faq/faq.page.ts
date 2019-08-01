import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  role : string = "";

  constructor(private navCtrl : NavController, public storage: Storage) { }

  ngOnInit() {
  }

  ionViewWillEnter() : void{
    this.storage.get('SessionRoleKey').then((roleval) => {
      this.role = roleval;
      console.log(this.role)
    });  
  }

  retour(){
    this.navCtrl.back();
  }

}
