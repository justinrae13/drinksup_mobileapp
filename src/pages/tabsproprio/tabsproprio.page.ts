import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { AborenewService } from '../../app/service/aborenew.service';

@Component({
  selector: 'app-tabsproprio',
  templateUrl: './tabsproprio.page.html',
  styleUrls: ['./tabsproprio.page.scss'],
})
export class TabsproprioPage implements OnInit {
  c_o_o_t_z : string = "1";
  c_d_o_t_z : string = "flex";

  goLeft : string = "translateX(0px)";
  goRight : string = "translateX(0px)";
  fadeOut : string = "1";

  constructor(private events : Events, private aborenew : AborenewService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.events.publish("wentThroughLogin");
  }

  // ionViewDidEnter(){
  //   if(!this.aborenew.wentThroughLoginPage){
  //     this.animate();
  //   }else{
  //     this.c_d_o_t_z = "none";
  //   }
  // }

  // animate(){
  //   setTimeout(() => {
  //     this.goLeft = "translateX(-70px)";
  //     this.goRight = "translateX(70px)";
  //     this.fadeOut = "0";
  //   }, 300);
  //   setTimeout(() => {
  //     this.c_o_o_t_z = "0"; 
  //   }, 1000);
  //   setTimeout(() => {
  //     this.c_d_o_t_z = "none";
  //   }, 1550);
  // }

}
