import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import * as Global from '../../app/global';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-custom-splashscreen',
  templateUrl: './custom-splashscreen.page.html',
  styleUrls: ['./custom-splashscreen.page.scss'],
})
export class CustomSplashscreenPage implements OnInit {
  baseURI = Global.mainURI;
  userSessionRole : string;
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';
  roleVIP = 'vip';
  goLeft : string = "translateX(0px)";
  goRight : string = "translateX(0px)";
  fadeOut : string = "1";
  paidUser : string;
  

  constructor(private http : HttpClient, private storage: Storage, private navCtrl : NavController, private nativePageTransitions: NativePageTransitions) {}

  ngOnInit() {
  }


  animate(){
    this.goLeft = "translateX(-70px)";
    this.goRight = "translateX(70px)";
    this.fadeOut = "0";
  }

  ionViewDidEnter(){
    // setTimeout(() => {
    //   this.animate();
    // }, 800);

    this.storage.get('SessionInKey').then((val) => {
      this.storage.get('SessionRoleKey').then((valRole) => {
          this.userSessionRole = valRole;

          // setTimeout(() => {
            if(val===null || valRole ===null){
              this.navCtrl.navigateRoot('/login');
              this.storage.remove("SessionInKey");
              this.storage.remove("SessionRoleKey");
              this.storage.remove("SessionEmailKey");
              this.storage.remove("SessionIdKey");
            }else{
              if(val==='Yes' && this.userSessionRole === this.roleAdmin){
                  this.navCtrl.navigateRoot('/tabsadmin/users');
              }else if(val==='Yes' && this.userSessionRole === this.roleProprio){
                  this.navCtrl.navigateRoot('/tabsproprio/qrcode');
              }else if(val==='Yes' && this.userSessionRole === this.roleUser){
                this.storage.get('SessionIdKey').then((valId) => {
                  this.getPaidUser(valId);
                });
              }else if(val==='Yes' && this.userSessionRole === this.roleVIP){
                this.navCtrl.navigateRoot('/tabs/offers');
              }else{
                return false;
              }
            }
          // }, 1250);

      });
    });
  }

  ionViewWillEnter(){
  
    
  }

  getPaidUser(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.paidUser = data.validity;

          if(data.validity !== "expired"){
            this.navCtrl.navigateRoot('/tabs/offers');
          }else{
            this.navCtrl.navigateRoot('/tabs/bars');
          }
        },  
        (error: any) => {
            console.log(error);
    });
  }

}
