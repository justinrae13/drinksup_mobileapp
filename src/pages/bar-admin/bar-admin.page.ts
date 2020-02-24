import { Component, AfterViewInit, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalController, NavController, ToastController, IonItemSliding, AlertController, IonContent} from '@ionic/angular';
import {ModalbarAdminPage} from '../modalbar-admin/modalbar-admin.page';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import * as Global from '../../app/global';

@Component({
  selector: 'app-bar-admin',
  templateUrl: './bar-admin.page.html',
  styleUrls: ['./bar-admin.page.scss'],
})
export class BarAdminPage{
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

  constructor(private nativeGeocoder: NativeGeocoder, private toastCtrl: ToastController, public http: HttpClient, public modalController: ModalController, private route: Router, public alertController: AlertController) { }

    ionViewWillEnter(){
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
    }
    
  public getProprio() {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getProprio'},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.users = data;
            this.usersFilter = this.users;
            this.tous();
        });

  }


    tous(){
        this.usersFilter = this.users;

        if (this.usersFilter.length === 0){
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

        if (this.usersFilter.length === 0 ){
            this.padDeDonee = true;
        }else{
            this.padDeDonee = false;
        }
    
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

        if (this.usersFilter.length === 0 ){
            this.padDeDonee = true;
        }else{
            this.padDeDonee = false;
        }
    
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

    scrollEvent(event){
        let currentScroll = event.detail.scrollTop;
        this.scrollOffsetTop = event.detail.scrollTop;
        if(this.scrollOffsetTop > 0){
            this.maincontent.scrollY = true;
        }
        
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
}
