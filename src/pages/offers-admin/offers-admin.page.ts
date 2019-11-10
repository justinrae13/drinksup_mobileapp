import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as Global from '../../app/global';
import { ToastController, AlertController, IonItemSliding, IonContent } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-offers-admin',
  templateUrl: './offers-admin.page.html',
  styleUrls: ['./offers-admin.page.scss'],
})
export class OffersAdminPage{
  public baseURI = Global.mainURI;
  offres : Array<any> = [];
  filteredOffres : Array<any> = [];
  pasDoffre : string = "";
  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  lastScroll : number = 0;
  hideHeader : string = "0";
  hideSubHeader: string = "50px";
  tousClicked : boolean = false;
  valideClicked : boolean = false;
  nonvalideClicked : boolean = false;

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

  padDeDonee : boolean = false;

  constructor(public http: HttpClient, private toastCtrl: ToastController, public alertController: AlertController) { }
  
  ionViewWillEnter() : void{
    this.getAllOffers();
    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
      //If user has no connection
      this.ifHasConnection = false;
    }
  }

  ionViewDidLeave(){
    this.tous();
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
  }

  async makeValid(slidingItem: IonItemSliding, id, desc, status) {
    await slidingItem.close();
    this.makeValidorNot(id, desc, status);
  }

  async makeValidorNot(id, desc, status) {
    var statVar, msg;
    if(status==="Oui"){
      statVar = "Non";
      msg = "<h3>Rendre l'offre : <span>" + desc + "</span> invalide ? </h3>";
    }else{
      statVar = "Oui";
      msg = "<h3>Valider l'offre : <span>" + desc + "</span> ? </h3>";
    }
    const alert = await this.alertController.create({
      header: "Confirmation",
      message: msg,
      cssClass : "dimBackdropAlert",
      buttons: [
          {
              text: 'Non',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
          }, {
              text: 'Oui',
              handler: () => {
                  this.validateOffer(id, statVar);
                  setTimeout(() => {
                    this.tous();
                    this.ionViewWillEnter();
                    this.sendNotification("Votre modification a été prise en compte !");
                }, 100);
              }
          }
      ]
    });

    await alert.present();
  }

  async deleteOffer(slidingItem: IonItemSliding, id, desc) {
    await slidingItem.close();

    const alert = await this.alertController.create({
      header: "Confirmation",
      message: "<h3>Supprimer l'offre : <span>" + desc + "</span> ? </h3>",
      cssClass : "dimBackdropAlert",
      buttons: [
          {
              text: 'Non',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
              }
          }, {
              text: 'Oui',
              handler: () => {
                  this.deleteOffre(id);
                  setTimeout(() => {
                    this.tous();
                    this.ionViewWillEnter();
                    this.sendNotification("Votre modification a été prise en compte !");
                }, 100);
              }
          }
      ]
    });

    await alert.present();
  }

  public getAllOffers() {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getAllValidOffers'},
        url: any      	= this.baseURI;
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

        data.forEach(function(data : any){
            moment.locale('fr');

            var newStart = moment(data.OFF_DATEDEBUT).format();
            var newEnd = moment(data.OFF_DATEFIN).format();

            if(data.OFF_DATEDEBUT !== null && data.OFF_DATEFIN !== null){
                data.OFF_DATEDEBUT = newStart;
                data.OFF_DATEFIN = newEnd;
            }

            var start = data.OFF_DATEDEBUT;
            var end = data.OFF_DATEFIN;

            data.startFR = moment(start).format('D MMMM YYYY à HH:mm');
            data.endFR = moment(end).format('D MMMM YYYY à HH:mm');
        });

        this.offres = data;
        this.filteredOffres = this.offres;

    });
  }


  validateOffer(id: number, status : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'validateOffre', 'id': id, 'status' : status},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
  }

  deleteOffre(id : number) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'deleteOffre', 'id': id},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
  }

  //My Stuff
  // scrollEvent(event){
  //   let currentScroll = event.detail.scrollTop;
  //   this.scrollOffsetTop = event.detail.scrollTop;
  //   if(this.scrollOffsetTop > 0){
  //       this.maincontent.scrollY = true;
  //   }
    
  //   if(currentScroll > 0 && this.lastScroll <= currentScroll){
  //       this.hideHeader = "-50px";
  //       this.hideSubHeader = "0px";
  //       this.lastScroll = currentScroll;
  //   }else{
  //       this.hideHeader = "0px";
  //       this.hideSubHeader = "50px";
  //       this.lastScroll = currentScroll;
  //   }
  // }

  // pullstart(e){
  //   this.touchStart = e.changedTouches[0].clientY;
  // }

  // pull(e){
  //   this.animDur = "0s";
  //   var touchEnd = e.changedTouches[0].clientY;
  
  //   if (this.touchStart > touchEnd) {
  //     this.refresherPosY--;
  //   } else {
  //     this.refresherPosY++;
  //   }

  //   //---------------------------------------------
  //   var incPosY = this.refresherPosY*12;

  //   if (this.touchStart > touchEnd) {

  //   }else {
  //     if(this.scrollOffsetTop == 0){
  //         this.maincontent.scrollY = false;
  //         this.ifPulled = true;
  //         if(incPosY>= 0 && incPosY <= 200){
  //           this.currPosY = incPosY;
  //           this.posY = "translateY("+incPosY+"px)";
  //         }
  //         if(incPosY > 150 && incPosY < 200){
  //           this.maincontent.scrollY = false;
  //         }else{
  //           this.maincontent.scrollY = true;
  //         }
  //     }
  //   }
  // }

  // endpull(){
  //   this.maincontent.scrollY = true;
  //   if(this.currPosY < 150){
  //     this.refresherPosY = 0;
  //     this.posY = "translateY("+this.refresherPosY+"px)";
  //     this.animDur = "200ms";
  //   }else{
  //     //
  //     if(this.scrollOffsetTop == 0 && this.ifPulled){
  //       this.ifPulled = false; 
  //       this.posY = "translateY("+150+"px)";
  //       this.animDur = "200ms";
  //       this.rotate = "rotate 600ms infinite linear";
  //       this.maincontent.scrollY = false;
  //       this.popFD = "block";
  //       setTimeout(() => {
  //         this.animDur = "500ms";
  //         this.rotate = "none";
  //         this.refresherPosY = 0;
  //         this.posY = "translateY("+this.refresherPosY+"px)";
  //       }, 2200);
  
  //       setTimeout(() => {
  //         this.popFD = "none";
  //         this.mainOpac = "0";
  //         //Put LifeCycle Hooks Here...
  //         this.ionViewWillEnter();
  //         //
  //       }, 2300);
        
  //       setTimeout(() => {
  //         this.mainOpac  = "1";
  //         this.maincontent.scrollY = true;
  //       }, 3000);
  //     }
  //     //
  //   }
    
  // }

tous(){
    this.filteredOffres = this.offres;

    if (this.filteredOffres.length === 0){
        this.padDeDonee = true;
    }else{
        this.padDeDonee = false;
    }

    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.valideClicked = false;
    this.nonvalideClicked = false;
}

valide(){
    this.tabPosition = "translateX(-50%)";
    this.leftPosition = "50%";
    this.activeColor2 = "#fff";
    this.activeColor1 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";
    
    this.filteredOffres = this.offres.filter(function(data : any){
        return data.OFF_ACTIF === "Oui"; 
    });

    if (this.filteredOffres.length === 0 ){
      this.padDeDonee = true;
    }else{
        this.padDeDonee = false;
    }


    this.tousClicked = false;
    this.valideClicked = true;
    this.nonvalideClicked = false;
}

nonvalide(){
    this.tabPosition = "translateX(-100%)";
    this.leftPosition = "100%";
    this.activeColor3 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor1 = "rgb(82, 82, 82)";

    this.filteredOffres = this.offres.filter(function(data : any){
      return data.OFF_ACTIF === "Non"; 
    }); 

    if (this.filteredOffres.length === 0 ){
      this.padDeDonee = true;
    }else{
        this.padDeDonee = false;
    }

    this.tousClicked = false;
    this.valideClicked = false;
    this.nonvalideClicked = true;
}

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
}



}
