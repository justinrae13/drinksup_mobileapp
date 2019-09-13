import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  exo : string = "premium";

  offres_icon : string = "1";
  favoris_icon : string = ".3";
  c_o_o_t_z : string = "1";
  c_d_o_t_z : string = "flex";

  goLeft : string = "translateX(0px)";
  goRight : string = "translateX(0px)";
  fadeOut : string = "1";

  ifPassThroughLogin : boolean = false;
  constructor(private storage : Storage) { }

  ionViewWillEnter(){
    this.storage.get('PassByLogin').then((val) => {
      if(val !== null){
        this.ifPassThroughLogin = true;
      }else{
        this.ifPassThroughLogin = false;
      }
    });
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

  ngOnInit() {
    
  }

  offreclick(){
    this.offres_icon = "1";
    this.favoris_icon = ".3";
  }

  barclick(){
    this.offres_icon = ".6";
    this.favoris_icon = ".3";
  }

  faveclick(){
    this.offres_icon = ".6";
    this.favoris_icon = "1";
  }

  profilclick(){
    this.offres_icon = ".6";
    this.favoris_icon = ".3";
  }

}
