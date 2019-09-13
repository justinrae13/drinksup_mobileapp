import { RegisterPage } from './../pages/register/register.page';
import { Component } from '@angular/core';
import { Platform, NavController, AlertController, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { matches } from '@ionic/core/dist/types/components/nav/view-controller';
import { RegisterthirdpartyPage } from './../pages/registerthirdparty/registerthirdparty.page';
import { ForgotPasswordPage } from 'src/pages/forgot-password/forgot-password.page';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Events } from '@ionic/angular';
import { AbonnementPage } from '../pages/abonnement/abonnement.page'



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  userSessionRole : string;
  ifMatchedDeeplink : boolean = false;
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';
  popup_bg : string;
  baseURI = "https://www.drinksup.ch/serveur/aksi.php";
  paidUser : string;

  constructor(
    private http : HttpClient,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private router: Router,
    private navCtrl : NavController,
    private deepLinks: Deeplinks,
    private alertCtrl: AlertController,
    public events: Events,
    private modalCtrl : ModalController
  ) {
    this.initializeApp();
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString("#101012");
      //
      this.deepLinks.route({
        '/register': RegisterPage,
        '/registerthirdparty': RegisterthirdpartyPage,
        '/forgot-password' : ForgotPasswordPage,
      }).subscribe(match =>{
          this.ifMatchedDeeplink = true;
          console.log("Match =>",match)
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
        },nomatch =>{
          this.ifMatchedDeeplink = false;
          console.log("No match =>",nomatch)
        });

      //Check if app is launch for the first time
        this.storage.get('firstLaunch_DrinksUp').then((first)=>{
          if(!this.ifMatchedDeeplink){
            console.log("The App was NOT launched by a deeplink")
            if(first!==null || first!==undefined){
              this.navCtrl.navigateForward('custom-splashscreen');
                setTimeout(() => {
                  this.splashScreen.hide();
                }, 500);
            }else{
              this.storage.set('firstLaunch_DrinksUp', 'Yes');
              this.storage.remove("SessionInKey");
              this.storage.remove("SessionRoleKey");
              this.storage.remove("SessionEmailKey");
              this.storage.remove("SessionIdKey");
              this.navCtrl.navigateForward('custom-splashscreen');
                // setTimeout(() => {
                  this.splashScreen.hide();
              // }, 500);
            }
          }else{
            console.log("The App was launched by a deeplink")
          }
        });


        //---------------------------------------------------------------
        this.storage.get('SessionIdKey').then((valId) => {
          this.storage.get('SessionRoleKey').then((role) => {
            this.getPaidUser(valId,role);
          });
        });
        //---
        this.events.subscribe("TriggerPopUp",()=>{
            this.storage.get('SessionIdKey').then((valId) => {
              this.storage.get('SessionRoleKey').then((role) => {
              this.getPaidUser(valId,role);
              });
            });
        });
        //---
        this.events.subscribe("closeWhenOnAboPage",()=>{
          this.closeWhenOnAboPage();
        });
        //---
        this.events.subscribe("reboundPopUp",()=>{
          this.closeWhenOnAboPage();
          this.storage.get('SessionIdKey').then((valId) => {
            this.storage.get('SessionRoleKey').then((role) => {
              this.getPaidUser(valId,role);
            });
          });
        });
        //---
        this.events.subscribe("removePopup",()=>{
            document.getElementById("gpw").classList.add("slideUp");
            setTimeout(() => {
              document.getElementById("gpw").style.transition = "all 0s";
            }, 350);
        });
   
    });
}


  //
  close(){
    document.getElementById("gpw").classList.add("slideUp");
    setTimeout(() => {
      document.getElementById("gpw").style.transition = "all 0s";
    }, 350);

    //Reset
    this.storage.get('SessionIdKey').then((valId) => {
      this.storage.get('SessionRoleKey').then((role) => {
        this.getPaidUser(valId,role);
      });
    });
  }

  closeWhenOnAboPage(){
    document.getElementById("gpw").classList.add("slideUp");
    document.getElementById("gpw").classList.remove("gbl_p_w");
    setTimeout(() => {
      document.getElementById("gpw").style.transition = "all 0s";
    }, 350);
  }

  popUp(){
    var randPic = Math.floor(Math.random() * 3) + 1;
    this.popup_bg = "../assets/popupbg/popup_bg_"+randPic+".jpg";
    document.getElementById("gpw").classList.remove("slideUp");
    document.getElementById("gpw").style.transition = "all .5s ease-out";
  }

  getPaidUser(id : string, role : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          // this.paidUser = data.validity;
          
          if(data.validity !== "good"){
            if(role === "user"){
              //popup test 
              console.log("Im popping up.........................hehe")
              setTimeout(() => {
                document.getElementById("gpw").classList.add("gbl_p_w");
              }, 500);
              setTimeout(() => {
                this.popUp();
              }, 121000);//121000
            }else{
              console.log("User must be an admin or a bar owner")
            }
          }else{
            console.log("User has a subscription")
          }
        },  
        (error: any) => {
            console.log(error);
        });
  }

  async goAbo(){
    const modal = await this.modalCtrl.create( {
      component: AbonnementPage,
      showBackdrop : true,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if(data.data === "back"){
        this.storage.get('SessionIdKey').then((valId) => {
          this.storage.get('SessionRoleKey').then((role) => {
            this.getPaidUser(valId,role);
          });
        });
      }else{
        console.log("User paid for a subscription")
      }
    })
    modal.present();
    //Close Popup
    setTimeout(() => {
      document.getElementById("gpw").classList.add("slideUp");
    }, 600);
    setTimeout(() => {
      document.getElementById("gpw").style.transition = "all 0s";
    }, 950);
  }

}
