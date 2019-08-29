import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalController, NavController, ToastController, IonItemSliding, AlertController} from '@ionic/angular';
import {ModalbarAdminPage} from '../modalbar-admin/modalbar-admin.page';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import * as Global from '../../app/global';

@Component({
  selector: 'app-bar-admin',
  templateUrl: './bar-admin.page.html',
  styleUrls: ['./bar-admin.page.scss'],
})
export class BarAdminPage implements OnInit {
  users = [];
  proprio = 0;
  bar: any = {};
  haveBarOrNot = '';
  user = null;
  usersFilter = [];
  public baseURI = Global.mainURI;
  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  lastScroll : number = 0;
  hideHeader : string = "0";
  hideSubHeader: string = "50px";
  tousClicked : boolean = false;
  actifClicked : boolean = false;
  inactifClicked : boolean = false;
  barFullAddress : string = "";

  //
  contentSlideUp : string = "translateY(100px)";
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

  constructor(private nativeGeocoder: NativeGeocoder, private toastCtrl: ToastController, public http: HttpClient, public modalController: ModalController, private route: Router, public alertController: AlertController) { }

    ngOnInit() {}

    ionViewWillEnter(): void {
        this.getProprio();

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
        this.contentSlideUp = "translateY(100px)";
    }
    
  public getProprio() {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getProprio'},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.users = data;
            this.usersFilter = this.users;
           // if (this.users == null ) {this.haveUserOrNot = 'Aucun Internaute ayant le role USERS'; } else {this.haveUserOrNot = ''; }
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
        this.usersFilter = this.users;
    
        this.tabPosition = "translateX(0%)";
        this.leftPosition = "0%";
        this.activeColor1 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
    
        this.tousClicked = true;
        this.actifClicked = false;
        this.inactifClicked = false;
    }
    
    actif(){
        this.tabPosition = "translateX(-50%)";
        this.leftPosition = "50%";
        this.activeColor2 = "#fff";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
        
        this.usersFilter = this.users.filter(function(data : any){
            return data.ENT_VALIDATION == "Oui"; 
        });
    
        this.tousClicked = false;
        this.actifClicked = true;
        this.inactifClicked = false;
    }
    
    inactif(){
        this.tabPosition = "translateX(-100%)";
        this.leftPosition = "100%";
        this.activeColor3 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor1 = "rgb(82, 82, 82)";
    
        this.usersFilter = this.users.filter(function(data : any){
            return data.ENT_VALIDATION == "Non"; 
        });   
    
        this.tousClicked = false;
        this.actifClicked = false;
        this.inactifClicked = true;
    }

    getBarFullAddress(idBar){
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { 'key' : 'getBarFullAddress', 'idBar': idBar},
            url: any = this.baseURI;
  
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.barFullAddress = data.ENT_ADRESSE+", "+data.ENT_NPA+" "+data.ENT_LOCALITE;

            console.log(this.barFullAddress)
        },(error: any) => {
            console.log(error);
        });
    }

    convertAddressToCoord(id){
        this.nativeGeocoder.forwardGeocode(this.barFullAddress, { useLocale: false, maxResults: 1 }).then((result: NativeGeocoderResult[]) => 
            this.addLongLatAfterValidation(result[0].latitude,result[0].longitude,id)
        ).catch((error: any) => console.log(error));
    }

    addLongLatAfterValidation(lat,long,id){
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { 'key' : 'addLongLatAfterValidation', 'lat': lat, 'long' : long, 'idBar' : id},
            url: any = this.baseURI;
  
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            console.log(data)
        },(error: any) => {
            console.log(error);
        });
    }



    async checkPartenaireBar(slidingItem: IonItemSliding, userId){
        await slidingItem.close();
        this.navTabs("bar/"+userId);
    }

    async delete(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        this.presentAlert(id, nom);
    }

    async cantDelete(slidingItem: IonItemSliding, nom) {
        await slidingItem.close();
        this.presentAlertSub(nom);
    }

    async validate(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        this.alertValidate(id, nom);
        this.getBarFullAddress(id);
    }

    async invalidate(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        this.alertInvalidate(id, nom);
        this.getBarFullAddress(id);
    }

    async alertInvalidate(id, nom) {
        const alert = await this.alertController.create({
            header: 'Confirmer',
            message: "<h3>Changer le status du bar: <span>" + nom + "</span> en <b class='b_inactif'>inactif</b> ?</h3>",
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
                        this.validateBar(id, "Non");
                        this.convertAddressToCoord(id);
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

    async alertValidate(id, nom) {
        const alert = await this.alertController.create({
            header: 'Confirmer',
            message: "<h3>Changer le status du bar: <span>" + nom + "</span> en <b class='b_actif'>actif</b> ?</h3>",
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
                        this.validateBar(id, "Oui");
                        this.convertAddressToCoord(id);
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

    

    async presentAlert(id, nom) {
        const alert = await this.alertController.create({
            header: 'Attention !',
            message: '<h3>Êtes vous sûr de vouloir supprimer le bar: <span>' + nom + '</span> ? </h3>',
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
                        this.deleteBar(id);
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

    async presentAlertSub(nom) {
        const alert = await this.alertController.create({
            header: 'Attention !',
            message: "<h3>Vous ne pouvez pas supprimer le bar: <span>" + nom + "</span> car son statut est actuellement actif</h3>",
            cssClass : "dimBackdropAlert",
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }
            ]
        });
        await alert.present();
    }

    deleteBar(id: number) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { 'key' : 'deleteBar', 'id': id},
            url: any = this.baseURI;
  
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        },(error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
    }

    validateBar(id, status) {
        const headers: any = new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any = { 'key' : 'changeStatus', 'id': id, 'status' : status},
            url: any = this.baseURI;
  
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        },(error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
    }

  //End of My stuff

    async validated(idUser, idEnt) {
        console.log('idUser : ' + idUser + ' idEnt : ' + idEnt);
        const modal = await this.modalController.create( {
            component: ModalbarAdminPage,
            componentProps: {
                idUser: idUser,
                idEnt: idEnt,
            },
        });
        modal.onDidDismiss().then(() => {
            this.getProprio();
        })
        modal.present();
        this.ionViewWillEnter();

    }


    async navTabs(msg: string) {
        this.route.navigateByUrl(msg);
    }


    async search(ev: any) {
        const val = ev.target.value;
        if (val && val.trim() !== '') {
            this.usersFilter = this.users.filter((users) => {
                return (users.ENT_NOM.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        } else {
          this.getProprio();
        }
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
