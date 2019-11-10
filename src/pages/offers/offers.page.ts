import { Component, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastController, ModalController, NavController, IonContent, IonSelect, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativePageTransitions, NativeTransitionOptions,  } from '@ionic-native/native-page-transitions/ngx';
import * as Global from '../../app/global';
import { AborenewService } from '../../app/service/aborenew.service';
import { AbonnementPage } from '../abonnement/abonnement.page'
import { Events } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage{
  @ViewChild(IonSelect) selectRef: IonSelect;
  customActionSheetOptions: any = {
    header: 'Choisissez le jour',
    subHeader: 'Défilez vers le bas pour voir tous les jours de la semaine'
  };
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  items : Array<any> = [];
  Filtereditems : Array<any> = [];
  scannedOffers : Array<any> = [];
  pushedScannedOffers : Array<any> = [];
  user_id;
  random : number;
  randomImgNo : number;
  contentSlideUp : string = "translateY(50px)";
  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  hideHeader : string = "0";
  hideSubHeader : string = "50px";
  lastScroll : number = 0;
  tousClicked : boolean = false;
  encoursClicked : boolean = false;
  imminentClicked : boolean = false;
  intervalInit;
  joursDeLaSemaine = [
    {num : '1', nomFr : 'Lundi'},
    {num : '2', nomFr : 'Mardi'},
    {num : '3', nomFr : 'Mercredi'},
    {num : '4', nomFr : 'Jeudi'},
    {num : '5', nomFr : 'Vendredi'},
    {num : '6', nomFr : 'Samedi'},
    {num : '7', nomFr : 'Dimanche'}
  ];
  noOffer : boolean = false;
  ifLoadedAlready : string = "block";
  //
  curtain_fade : string = "1";
  curtain_hide : string = "flex";
  spinner_fade  : string = "1";

  //
  ifHasConnection : boolean = true;
  //Custom Refresher Made By Jutin Rae
  @ViewChild(IonContent) maincontent: IonContent;
  scrollOffsetTop : number = 0;
  touchStart : number = 0;
  refresherPosY : number = 0;
  currPosY : number = 0;
  ifPulled : boolean = false;
  posY : string = "translateY(0px)";
  animDur : string = "0s";
  rotate : string = "none";
  popFD : string = "none";
  mainOpac : string = "1";
  showBanner : boolean = true;
  //
  popSpinner : string = "none"; 
  // bannerSlidDown : string = "translateY(0)"; 


  constructor(private alertCtrl: AlertController, private events: Events, private aborenew : AborenewService, private navCtrl : NavController, private nativePageTransitions: NativePageTransitions, private modalCtrl : ModalController, private storage : Storage, private http : HttpClient, private toastCtrl : ToastController) { 
    this.random = Math.floor(Math.random() * 100);
    this.randomImgNo = Math.floor(Math.random() * 3)+1;
    this.storage.get('SessionIdKey').then((val) => {
      this.aborenew.triggerRenewal(val,"CheckIT");
    }); 

  
    this.events.subscribe("pre-init-offer",()=>{
      this.storage.get('SessionIdKey').then((val) => {
        this.getPaidUser(val);
      }); 
    });

    setTimeout(() => {
      this.spinner_fade = "0";
    }, 1100);

    setTimeout(() => {
      this.curtain_fade = "0";
    }, 1450);
    setTimeout(() => {
        this.curtain_hide = "none";
    }, 2000);
      
  }

  scrollEvent(event){
    this.scrollOffsetTop = event.detail.scrollTop;
    if(this.scrollOffsetTop > 0){
      this.maincontent.scrollY = true;
    }
  }

  pullstart(e){
    this.touchStart = e.changedTouches[0].clientY;
  }

  pull(e){
    this.animDur = "0s";
    var touchEnd = e.changedTouches[0].clientY;
  
    if (this.touchStart > touchEnd) {
      this.refresherPosY--;
    } else {
      this.refresherPosY++;
    }

    //---------------------------------------------
    var incPosY = this.refresherPosY*12;

    if (this.touchStart > touchEnd) {

    }else {
      if(this.scrollOffsetTop == 0){
          this.maincontent.scrollY = false;
          this.ifPulled = true;
          if(incPosY>= 0 && incPosY <= 200){
            this.currPosY = incPosY;
            this.posY = "translateY("+incPosY+"px)";
          }
          if(incPosY > 150 && incPosY < 200){
            this.maincontent.scrollY = false;
          }else{
            this.maincontent.scrollY = true;
          }
      }
    }
  }

  endpull(){
    this.maincontent.scrollY = true;
    if(this.currPosY < 150){
      this.refresherPosY = 0;
      this.posY = "translateY("+this.refresherPosY+"px)";
      this.animDur = "200ms";
    }else{
      //
      if(this.scrollOffsetTop == 0 && this.ifPulled){
        this.ifPulled = false; 
        this.posY = "translateY("+150+"px)";
        this.animDur = "200ms";
        this.rotate = "rotate 600ms infinite linear";
        this.maincontent.scrollY = false;
        this.popFD = "block";
        setTimeout(() => {
          this.animDur = "500ms";
          this.rotate = "none";
          this.refresherPosY = 0;
          this.posY = "translateY("+this.refresherPosY+"px)";
        }, 2200);
  
        setTimeout(() => {
          this.popFD = "none";
          this.mainOpac = "0";
          //Put LifeCycle Hooks Here...
          this.ionViewWillEnter();
          //
        }, 2300);
        
        setTimeout(() => {
          this.mainOpac  = "1";
          this.maincontent.scrollY = true;
        }, 3000);
      }
      //
    }
    
  }

  ionViewWillEnter(){
    this.popUpCond(); 
    this.events.publish("checkLastEntry");
    
    this.storage.get('SessionIdKey').then((val) => {
      this.getPaidUser(val);
      this.loadBar(val);
      this.aborenew.triggerRenewal(val,null);
    }); 
 

    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
      //If user has no connection
      this.ifHasConnection = false;
    }

    // this.intervalInit = setInterval(() => { 
    //   this.setCountDown(); 
    // }, 1000);   
  }

  ionViewDidLeave(){
    clearInterval(this.intervalInit);
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    this.tous();

    this.selectRef.value = "all";
    this.storage.set('showDebutPopUp', 'No');
  }

  getPaidUser(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.storage.get('SessionRoleKey').then((role) => {
            if(data.validity !== "good"){
              if(role === "user"){
                this.showBanner = true;
              }else{
                this.showBanner = false;
              }
            }else{
              console.log("[From Offer page] - User is subscibed");
              this.showBanner = false;
            }
          });
         
          
        },  
        (error: any) => {
            console.log(error);
        });
  }

  loadBar(userId) : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "getAllOffers", "user_id" : userId},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        for(var i in data){
            data[i].OFF_DATEDEBUT = moment(data[i].OFF_DATEDEBUT).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
        }
        this.items = data;
        this.Filtereditems = this.items;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  setCountDown(){
      let range = this.Filtereditems.length;
      let data = this.Filtereditems;

      for(var i = 0; i<range; i++){
        // Get todays date and time
        let startDate = new Date(data[i].OFF_DATEDEBUT).getTime();
        let endDate = new Date(data[i].OFF_DATEFIN).getTime();
        let now = new Date().getTime();

        // Output the result in an element with id="demo"
        if(now>startDate){
          // Find the distance between now and the count down date
          let distance = endDate - now;
          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(distance<0){
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "Offre terminée";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "rgb(82,82,82)";
          }else{
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "expire dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "rgba(196, 0, 0, .4)";
            document.getElementById("countdown_"+data[i].OFF_ID).style.border = "1px solid rgb(196, 0, 0)";
            document.getElementById("countdown_"+data[i].OFF_ID).style.color = "#fff";
          }
        }else{
          // Find the distance between now and the count down date
          let distance = startDate - now;
          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(document.getElementById("countdown_"+data[i].OFF_ID) !== null){
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "active dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "transparent";            
          }
        }
      }
  }

  tous(){
    this.Filtereditems = this.items;

    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.encoursClicked = false;
    this.imminentClicked = false;
  }

  encours(){
    this.tabPosition = "translateX(-50%)";
    this.leftPosition = "50%";
    this.activeColor2 = "#fff";
    this.activeColor1 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.Filtereditems = this.items.filter(function(data : any){
      var today = new Date().getTime();
      var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
      return today>dateStart; 
    });

    this.tousClicked = false;
    this.encoursClicked = true;
    this.imminentClicked = false;
  }

  imminent(){
    this.tabPosition = "translateX(-100%)";
    this.leftPosition = "100%";
    this.activeColor3 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor1 = "rgb(82, 82, 82)";

    this.Filtereditems = this.items.filter(function(data : any){
      var today = new Date().getTime();
      var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
      return today<dateStart; 
    });   

    this.tousClicked = false;
    this.encoursClicked = false;
    this.imminentClicked = true;
  }

  openSelect(){
    this.selectRef.open();
  }

  filterByDay(event){

    if(this.Filtereditems === null){
      return false;
    }else{
      if(event.detail.value=="all"){
        this.Filtereditems = this.items;
      }else{
        this.Filtereditems = this.items.filter((offer) => {
          var dateStart = new Date(offer.OFF_DATEDEBUT).getDay();
          return (dateStart == event.detail.value);
        });
      }
    }

    if(this.Filtereditems.length <= 0){
      this.noOffer = true;
    }else{
      this.noOffer = false;
    }
    
    
  }

  moveToBar(id : string, id_offer : string){
    let opt : NativeTransitionOptions = {
      duration: 450,
      iosdelay: 100,
      androiddelay: 100
    }
    this.nativePageTransitions.fade(opt); 
    this.navCtrl.navigateForward("/bar-user/"+id+"/"+id_offer);  
  }

  displayNone(){
    setTimeout(() => {
      this.ifLoadedAlready = "none"
    }, 1200);
  }

  async goAbo(){
    const modal = await this.modalCtrl.create( {
      component: AbonnementPage,
      showBackdrop : true,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      if(data.data === "back"){
        this.events.publish("reboundPopUp");
        console.log("Payment cancelled");
      }else{
        console.log("User paid for a subscription");
        this.ionViewWillEnter();
      }
    })
    modal.present();
    this.events.publish("closeWhenOnAboPage");
  }

  popUpCond() : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "popUpCondition"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        console.log("POPUP", data.showpopup)

        this.storage.get('showDebutPopUp').then((debut)=>{
          if(debut === null || debut === undefined || debut === ""){
            if(data.showpopup === 1){
                setTimeout(() => {
                  this.popUpDebutAlert();
                }, 2000);
            }
          }else{
              setTimeout(() => {
                this.popUpDebutAlert();
              }, 2000);
          }
        });
        
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  async popUpDebutAlert(){
    const alert = await this.alertCtrl.create({
        message: "Profitez des offres gratuitement pendant la période d'essai.",
        cssClass : "popUpDebut_small",
        buttons: [
            {
                text: 'x',
            },
        ]
    });

    await alert.present();
}
  
}
