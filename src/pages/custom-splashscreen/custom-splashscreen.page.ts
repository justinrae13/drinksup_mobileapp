import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';

@Component({
  selector: 'app-custom-splashscreen',
  templateUrl: './custom-splashscreen.page.html',
  styleUrls: ['./custom-splashscreen.page.scss'],
})
export class CustomSplashscreenPage implements OnInit {
  userSessionRole : string;
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';
  goLeft : string = "translateX(0px)";
  goRight : string = "translateX(0px)";
  fadeOut : string = "1";


  constructor(private storage: Storage, private navCtrl : NavController, private nativePageTransitions: NativePageTransitions) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.animate()
    }, 800);
  }

  animate(){
    this.goLeft = "translateX(-70px)";
    this.goRight = "translateX(70px)";
    this.fadeOut = "0";
  }

  ionViewWillEnter(){
    setTimeout(() => {
      this.animate()
    }, 800);

    //Check if app is launch for the first time
    this.storage.get('firstLaunch').then((first)=>{
      if(first!==null){
        console.log("App is not launch for the first time");
      }else{
        this.storage.set('firstLaunch', 'Yes');
        this.storage.remove("SessionInKey");
        this.storage.remove("SessionRoleKey");
        this.storage.remove("SessionEmailKey");
        this.storage.remove("SessionIdKey");
        this.storage.remove("firstLogin");
        setTimeout(() => {
          this.navCtrl.navigateRoot('/login');
        }, 400);
      }
    });

    
    this.storage.get('SessionInKey').then((val) => {
        this.storage.get('SessionRoleKey').then((valRole) => {
            this.userSessionRole = valRole;

            console.log('val '  + val + ' valRole ' + valRole);
            
            setTimeout(() => {
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
                    this.navCtrl.navigateRoot('/tabs/offers');
                }else{
                  return false;
                }
              }
            }, 400);

        });
      });
  }

}
