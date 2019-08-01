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
  constructor(public http: HttpClient, private toastCtrl: ToastController, public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter() : void{
    this.getAllOffers();
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
                  this.ionViewWillEnter();
              }
          }
      ]
    });

    await alert.present();
  }

  // async makeValid(slidingItem: IonItemSliding, id, desc, status) {
  //   await slidingItem.close();
  //   var statVar, msg;
  //   if(status==="Oui"){
  //     statVar = "Non";
  //     msg = "<h3>Rendre l'offre : <span>" + desc + "</span> invalide ? </h3>";
  //   }else{
  //     statVar = "Oui";
  //     msg = "<h3>Valider l'offre : <span>" + desc + "</span> ? </h3>";
  //   }
  //   const alert = await this.alertController.create({
  //     header: "Confirmation",
  //     message: msg,
  //     buttons: [
  //         {
  //             text: 'Non',
  //             role: 'cancel',
  //             cssClass: 'secondary',
  //             handler: () => {
  //             }
  //         }, {
  //             text: 'Oui',
  //             handler: () => {
  //                 this.validateOffer(id, statVar);
  //                 this.ionViewWillEnter();
  //             }
  //         }
  //     ]
  //   });

  //   await alert.present();
  // }

  async deleteOffer(slidingItem: IonItemSliding, id, desc) {
    await slidingItem.close();

    const alert = await this.alertController.create({
      header: "Confirmation",
      message: "<h3>Supprimer l'offre : <span>" + desc + "</span> ? </h3>",
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
                  this.ionViewWillEnter();
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
            this.sendNotification('Votre Modification a bien été pris en compte !');
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
            this.sendNotification('Votre suppresion a bien été pris en compte !');
            console.log('ouais bien');
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
  }

  //My Stuff
  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;

    if(currentScroll > 0 && this.lastScroll <= currentScroll){
        this.hideHeader = "-50px";
        this.hideSubHeader = "0px";
        this.lastScroll = currentScroll;
    }else{
        this.hideHeader = "0px";
        this.hideSubHeader = "50px";
        this.lastScroll = currentScroll;
    }
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
        position: 'bottom'
    });
    toast.present();
}



}
