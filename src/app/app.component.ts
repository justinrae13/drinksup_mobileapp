import { RegisterPage } from './../pages/register/register.page';
import { Component } from '@angular/core';
import { Platform, NavController, AlertController, ModalController, ToastController } from '@ionic/angular';
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
import * as moment from 'moment-timezone'

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
  popUpInterval;

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
    private modalCtrl : ModalController,
    private toastCtrl : ToastController,
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
            this.getLastEntry(valId);
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

        //---
        this.events.subscribe("checkLastEntry",()=>{
          this.storage.get('SessionIdKey').then((valId) => {
            this.getLastEntry(valId);
          });
        });
   
    });
}


  //
  close(){
    // clearInterval(this.popUpInterval);  
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
    clearInterval(this.popUpInterval);
  }

  showBox(){
    var randPic = Math.floor(Math.random() * 3) + 1;
    this.popup_bg = "../assets/popupbg/popup_bg_"+randPic+".jpg";
    document.getElementById("gpw").classList.remove("slideUp");
    document.getElementById("gpw").style.transition = "all .5s ease-out";
    clearInterval(this.popUpInterval);
  }

  getPaidUser(id : string, role : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          // this.paidUser = data.validity;
          if(role === "user"){
            if(data.validity !== "good"){
              this.popUpInterval = setInterval(() => { 
                this.showBox();
              }, 121000 );//121000
            }else{
              console.log("User has a subscription")
            }
          }else{
            console.log("User must be an admin,bar owner or a V.I.P")
          }
        },  
        (error: any) => {
            console.log(error);
        });
  }

  updateLastEntry(id : string, today : any) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'updateLastEntry', 'idUser': id, 'ojd' : today },
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
      console.log(data.message)
    },  
    (error: any) => {
        console.log(error);
    });
  }

  getLastEntry(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getLastEntry', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

        var today = moment().tz("Europe/Zurich");
        var lastentry = moment(data.INT_LASTENTRY);
        var diff = today.diff(lastentry, "days");

        if(data.INT_LASTENTRY === null || data.INT_LASTENTRY === "null" || data.INT_LASTENTRY === ""){
          this.updateLastEntry(id, today);
        }else{
          if(diff >= 7){
            setTimeout(() => {
              this.sendNotification("Ça fait longtemps qu'on ne t'a pas vu !");
            }, 3000);
            setTimeout(() => {
              this.updateLastEntry(id, today)
            }, 3100);
          }else{
            this.updateLastEntry(id ,today)
          }
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

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 5000,
        position: 'top'
    });
    toast.present();
}

}


