import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as Global from '../../app/global';
import { ToastController, AlertController, IonItemSliding } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-offers-admin',
  templateUrl: './offers-admin.page.html',
  styleUrls: ['./offers-admin.page.scss'],
})
export class OffersAdminPage implements OnInit {
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
  contentSlideUp : string = "translateY(108px)";
  //
  ifHasConnection : boolean = true;
  //Custom Refresher Made By Jutin Rae
  scrollOffsetTop : number = 0;
  scrollCounter : number = 0;
  highCounter : number = 227;
  mcr_scale : string = "scale(0)";
  mcr_dashoffset : string = "227";
  mcr_trans: string = "0s";
  mcr_svgDisplay : string = "block";
  mcr_circleDivDisplay : string = "none";
  mcr_bdDisplay : string = "none";
  lastY : number = 0;
  constructor(public http: HttpClient, private toastCtrl: ToastController, public alertController: AlertController) { }

  ngOnInit() {
  }

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
    this.contentSlideUp = "translateY(108px)";
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
        options: any		= { 'key' : 'getAllInactiveOffers'},
        url: any      	= this.baseURI;
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

          for(var i in data){

            var newStart = new Date(data[i].OFF_DATEDEBUT);
            var newEnd = new Date(data[i].OFF_DATEFIN);

            var mnewStart = moment(newStart).format();
            var mnewEnd = moment(newEnd).format();

            if(data[i].OFF_DATEDEBUT !== null && data[i].OFF_DATEFIN !== null){
                data[i].OFF_DATEDEBUT = mnewStart;
                data[i].OFF_DATEFIN= mnewEnd;
            }
        }
        this.offres = data;
        this.filteredOffres = this.offres;

        if (this.offres == null ) {
          this.pasDoffre = "Pas d'offre"; 
        }
 
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
  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;
    this.scrollOffsetTop = event.detail.scrollTop;
    
    if(currentScroll > 0 && this.lastScroll <= currentScroll){
        this.hideHeader = "-50px";
        this.hideSubHeader = "0px";
        this.contentSlideUp = "translateY(0px)";
        this.lastScroll = currentScroll;
    }else{
        this.hideHeader = "0px";
        this.hideSubHeader = "50px";
        this.contentSlideUp = "translateY(100px)";
        this.lastScroll = currentScroll;
    }
  }

  touchmove(event){
    if(this.scrollOffsetTop ==0){

      var currentY = event.touches[0].screenY;

      if(currentY > this.lastY){
        this.scrollCounter++;
      }else if(currentY < this.lastY){
        this.scrollCounter--;
      }

      this.lastY = currentY;
      var slowedCounter = this.scrollCounter/45;
      var doffSet = 227;

      if(slowedCounter <= 1 && slowedCounter > 0){
        this.mcr_scale = "scale("+slowedCounter+")";
        doffSet-=(this.scrollCounter*Math.PI);
        this.mcr_dashoffset = doffSet.toString();
      }

      if(slowedCounter == 1){
        this.mcr_trans = ".2s ease 1.5s";
        this.mcr_svgDisplay = "none";
        this.mcr_circleDivDisplay = "block";
        this.mcr_bdDisplay = "block";
        setTimeout(() => {
          this.mcr_trans = "0s ease 0s";
        }, 1800);
        setTimeout(() => {
          this.mcr_svgDisplay = "block";
          this.mcr_circleDivDisplay = "none";
        }, 2100);
        setTimeout(() => {
          this.ionViewWillEnter();
          this.mcr_bdDisplay = "none";        
        }, 2200);
      }

    }
      
  }

  touchend(){
    this.scrollCounter = 0;
    this.mcr_scale = "scale("+this.scrollCounter+")";
  }

tous(){
    this.filteredOffres = this.offres;

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
