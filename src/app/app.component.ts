import { RegisterPage } from './../pages/register/register.page';
import { Component } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { matches } from '@ionic/core/dist/types/components/nav/view-controller';
import { RegisterthirdpartyPage } from './../pages/registerthirdparty/registerthirdparty.page';
import { ForgotPasswordPage } from 'src/pages/forgot-password/forgot-password.page';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  userSessionRole : string;
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private navCtrl : NavController,
    private deepLinks: Deeplinks,
  ) {
    this.initializeApp();
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#101012");
      //
      this.navCtrl.navigateForward('custom-splashscreen');
      setTimeout(() => {
        this.splashScreen.hide();
      }, 800);

      this.deepLinks.route({
        '/register': RegisterPage,
        '/registerthirdparty': RegisterthirdpartyPage,
        '/forgot-password' : ForgotPasswordPage,
      }).subscribe((match) =>{
          console.log(match)
          if(match.$link.path == "/registerthirdparty"){
            const name = JSON.stringify(match.$args.name);
            const email = JSON.stringify(match.$args.email);
            const id = JSON.stringify(match.$args.id);
            this.navCtrl.navigateForward('registerthirdparty/'+name+"/"+email+"/"+id);
          }else if(match.$link.path == "/register"){
            const email = JSON.stringify(match.$args.email);
            this.navCtrl.navigateForward('register/'+email);
          }else{
            const email = JSON.stringify(match.$args.email);
            this.navCtrl.navigateForward('forgot-password/'+email);
          }
        });
      

      //Check if app is launch for the first time
      // this.storage.get('firstLaunch').then((first)=>{
      //   if(first!==null){
      //     console.log("App is not launch for the first time");
      //   }else{
      //     this.storage.set('firstLaunch', 'Yes');
      //     this.storage.remove("SessionInKey");
      //     this.storage.remove("SessionRoleKey");
      //     this.storage.remove("SessionEmailKey");
      //     this.storage.remove("SessionIdKey");
      //     this.storage.remove("firstLogin");
      //     this.navCtrl.navigateRoot('/login');
         
      //   }
      // });

      // this.storage.get('SessionInKey').then((val) => {
      //   this.storage.get('SessionRoleKey').then((valRole) => {
      //       this.userSessionRole = valRole;

      //       console.log('val '  + val + ' valRole ' + valRole);
      //       if(val===null || valRole ===null){
      //         this.navCtrl.navigateRoot('/login');
      //         this.storage.remove("SessionInKey");
      //         this.storage.remove("SessionRoleKey");
      //         this.storage.remove("SessionEmailKey");
      //         this.storage.remove("SessionIdKey");
      //       }else{
      //       if(val==='Yes' && this.userSessionRole === this.roleAdmin){
      //         this.navCtrl.navigateRoot('/tabsadmin/users');
      //       }
      //         // if(val==='Yes' && this.userSessionRole === this.roleAdmin){
      //         //   this.navCtrl.navigateRoot('/tabsadmin/users');
      //         // }else if(val==='Yes' && this.userSessionRole === this.roleProprio){
      //         //     this.navCtrl.navigateRoot('/tabsproprio/qrcode');
      //         // }else if(val==='Yes' && this.userSessionRole === this.roleUser){
      //         //     this.navCtrl.navigateRoot('/tabs/offers');
      //         // }else{
      //         //   return false;
      //         // }
      //         console.log("I still went here !! :(")
      //       }
      //   });
      // });


    });

  }
}
