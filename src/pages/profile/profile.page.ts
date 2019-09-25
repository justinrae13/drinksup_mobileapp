import { ToastController, AlertController, IonContent } from '@ionic/angular';
import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, ModalController, IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';
import {Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as moment from 'moment';
import 'moment/locale/fr';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ModalChangeUserphotoPage } from '../modal-change-userphoto/modal-change-userphoto.page'
import { ModalToSponsorPage } from '../modal-to-sponsor/modal-to-sponsor.page'
import { ModalToSharePage } from '../modal-to-share/modal-to-share.page'
import { ModalGetSponsoredPage } from '../modal-get-sponsored/modal-get-sponsored.page'
import { LoadingpagePage } from '../loadingpage/loadingpage.page'
import { AbonnementPage } from '../abonnement/abonnement.page'
import * as Global from '../../app/global';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { AborenewService } from '../../app/service/aborenew.service';
import { Events } from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage{
    @ViewChild(IonSelect) selectRef: IonSelect;
    customActionSheetOptions: any = {
        header: 'Sélectionnez votre ville préférée.',
        subHeader: 'Cette option vous permettra de filtrer par ville les Top 10 bars de Drinks Up.'
    };
    loggedUser : any = {};
    baseURI = Global.mainURI;
    userPhotoURI = "https://www.drinksup.ch/serveur/userphotos/";

    roleUser = 'user';
    roleAdmin = 'admin';
    roleProprio = 'proprio';
    profilePic : string;
    defaultPic : string = "../../assets/img/user-icon.svg";
    userSessionRole : string;
    paidUser : string;
    ifHasBeenSubscribed : number = null;
    data: any;
    dateInscription = '';
    loadHeight : string = "100%";
    loadSlide : string = "translateX(0px)";
    idInternaute: number;
    allVille = [];
    abonneDetail : any = {};
    curtain_fade : string = "1";
    curtain_hide : string = "block";

    //USER LEVEL SHIT STUFF
    userNumberOfMonthsRegistered : number = 0;
    userNumberOfOffers : number = 0;
    userNumberOfGivenRatings : number = 0;
    userNumberOfSponsors : number = 0;

    //
    parrainageAlert : any;
    globalmsg : any;
    //
    the_copied_code : string = "";
    the_pasted_code : string = "- - - - - - -";
    the_code_exists : boolean = false;
    if_already_sponsored : boolean = false;

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
    constructor(private events: Events, private aborenew : AborenewService, private nativePageTransitions: NativePageTransitions, public alertCtrl: AlertController, private toastCtrl : ToastController,private modalCtrl : ModalController,private emailComposer: EmailComposer,private fb: Facebook, private googlePlus : GooglePlus, private route: Router, public navCtrl : NavController, public storage: Storage, private http : HttpClient) {
        this.storage.get('SessionIdKey').then((valId) => {
            this.aborenew.triggerRenewal(valId,"CheckIT");
        });

    
        this.events.subscribe("LOOL",()=>{
            alert("dfsdfsdfd  ")
        });

        setTimeout(() => {
            this.curtain_fade = "0";
        }, 1200);
        setTimeout(() => {
            this.curtain_hide = "none";
        }, 1800);
  
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
        if(this.scrollOffsetTop <= 0){
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
        if(this.scrollOffsetTop <= 0 && this.ifPulled){
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

    ionViewWillEnter() : void{
        this.getVille();
        
        this.storage.get('SessionIdKey').then((val) => {
            this.loadData(val);
            this.getPaidUser(val);
            this.getDetailAbonnement(val);
            this.getUserNumOffers(parseInt(val));
            this.getUserNumRatings(parseInt(val));
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
    }

    loadData(idSession : string){
        let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
            options 	: any		= {"key" : "getUsersById", "idSession" : idSession},
            url       : any   = this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
            {
                this.loggedUser = data;
                this.dateInscription = moment(this.loggedUser.INT_DATEINSCRIPTION, "YYYYMMDD").fromNow();
                this.idInternaute = this.loggedUser.INT_ID;
                this.userNumberOfMonthsRegistered = moment().diff(moment(this.loggedUser.INT_DATEINSCRIPTION), 'months', true);
                

                this.the_copied_code = this.loggedUser.INT_CODE;
                this.getUserNumSponsor(this.loggedUser.INT_CODE);
                //User Picture
                var random = Math.floor(Math.random() * 10000);
                this.profilePic = this.userPhotoURI+this.loggedUser.INT_EMAIL+"_photo.jpg?random="+random;
            },
            (error : any) =>
            {
                console.dir(error);
            });
    }

    getPaidUser(id : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getPaidUser', 'idUser': id},
            url: any      	= this.baseURI;
      
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
              console.log(data);
              this.paidUser = data.validity;
            },  
            (error: any) => {
                console.log(error);
            });
    }

    getVille() {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getAllVille'},
        url: any      	= this.baseURI;
    
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.allVille = data;
        },  
        (error: any) => {
            console.log(error);
        });
    }

    logoutFromApp(){
        this.storage.remove("SessionInKey");
        this.storage.remove("SessionRoleKey");
        this.storage.remove("SessionEmailKey");
        this.storage.remove("SessionIdKey");
        this.storage.remove("TriggerOnce");
        this.storage.remove("TriggerAlertOnce");
        this.storage.remove("PassByLogin");
        this.googlePlus.logout().then(res => {console.log(res);}).catch(err => console.error(err));
        this.fb.logout();
        this.navCtrl.navigateRoot('login');
        this.events.publish("closeWhenOnAboPage");
    }

    async changerPhoto(useremail : string){
        const modal = await this.modalCtrl.create( {
            component: ModalChangeUserphotoPage,
            cssClass: "edit-profilepic-modal",
            showBackdrop : true,
            componentProps: {
                email : useremail
            },
        });
        modal.onDidDismiss().then((data) => {
            if(data.data === undefined){
                console.log("Just an ordinary cancellation");
            }else if(data.data.uploaded == "Yes"){
                this.storage.get('SessionIdKey').then((userId) => {
                    this.updateUserAttr(parseInt(userId));
                }); 
                this.loadingModal();//open loading modal
            }else{
                console.log("Just an ordinary cancellation");
            }
        })
        modal.present();
    }

    async loadingModal() {
        const modal = await this.modalCtrl.create( {
            component: LoadingpagePage,
            cssClass: "loading-modal",
            showBackdrop : true,
            componentProps: {},
        });
        modal.present();
        setTimeout(() => {
          modal.dismiss();
        }, 6000);
        modal.onDidDismiss().then(() => {
            this.ionViewWillEnter();
        });
      }

    async navTabs(msg: string) {
        this.route.navigateByUrl(msg);
    }

    openSelect(){
        this.selectRef.open();
    }

    goSetting(){
        this.navTabs('/settings');
    }


    goFaq(){
        this.navTabs('/faq');
    }

    goCgu(){
        this.navTabs('/cgu');
    }

    async goAbonnement(){
        const modal = await this.modalCtrl.create( {
            component: AbonnementPage,
            showBackdrop : true,
            componentProps: {},
        });
        modal.onDidDismiss().then((data) => {
            this.ionViewWillEnter();
            if(data.data === "paymentDone"){
                this.events.publish("pre-init-offer");
                setTimeout(() => {
                    this.curtain_fade = "0";
                }, 1400);
                setTimeout(() => {
                    this.curtain_hide = "none";
                }, 1950);
                
            }else if(data.data === "back"){
                this.events.publish("reboundPopUp");
                console.log("Payment cancelled");
                this.curtain_fade = "0";
                setTimeout(() => {
                        this.curtain_hide = "none";
                }, 550);
            }else{
                this.events.publish("reboundPopUp");
                console.log("Payment cancelled");
               this.curtain_fade = "0";
               setTimeout(() => {
                    this.curtain_hide = "none";
               }, 550);
            }
        })
        modal.present();
        this.curtain_fade = "1";
        this.curtain_hide = "block";
        this.events.publish("closeWhenOnAboPage");
        
    }

    getDetailAbonnement(id : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getDetailAbonnement', 'idUser': id},
            url: any      	= this.baseURI;
      
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {


            if(data.ABO_DATEDEBUT !== undefined){
                var newStart = new Date(data.ABO_DATEDEBUT).toISOString();
                var newEnd = new Date(data.ABO_DATEFIN).toISOString();
                data.ABO_DATEDEBUT = newStart;
                data.ABO_DATEFIN= newEnd;
                this.abonneDetail = data;
            }else{
                return false;
            }
                
            },  
            (error: any) => {
                console.log(error);
            });
      }

    sendEmail(){

        var role = this.loggedUser.Roles_ROL_ID;
        var emailAdd;

        if(role === 4 || role === 3){
            emailAdd = "info@drinksup.ch";
        }else if(role === 2){
            emailAdd = "business@drinksup.ch";
        }else{
            return false;
        }


        const email = {
            to: emailAdd,
            subject: 'Drinks up contact',
            body: '',
            isHtml: true
        };

// Send a text message using default options
        this.emailComposer.open(email);
    }


    //USER LEVEL SHIT STUFF
    updateUserLevel(id : number, level : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'userUpdateLevel', 'idParam': id, 'levelParam' : level},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                console.log(data);
            },  
            (error: any) => {
                console.log(error);
            });
    }


    updateUserAttr(id : number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'userPhotoChanged', 'idParam': id},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                console.log(data);
            },  
            (error: any) => {
                console.log(error);
            });
    }

    getUserNumOffers(id : number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getNumberOfferByUser', 'idParam': id},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.userNumberOfOffers = data.total;
            },  
            (error: any) => {
                console.log(error);
            });
    }

    getUserNumRatings(id : number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getNumberRatingsByUser', 'idParam': id},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.userNumberOfGivenRatings = data.total;

                setTimeout(() => {
                    this.checkLevelStatus(id);
                }, 100); 
            },  
            (error: any) => {
                console.log(error);
            });
    }

    getUserNumSponsor(code : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getNumberSponsorByUser', 'code': code},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.userNumberOfSponsors = data.total;
            },  
            (error: any) => {
                console.log(error);
            });
    }

    checkLevelStatus(id){
        // console.log("Sponsors=>"+this.userNumberOfSponsors+"\n\nMonths=>"+this.userNumberOfMonthsRegistered+"\n\nOffers=>"+this.userNumberOfOffers+"\n\nRatings=>"+this.userNumberOfGivenRatings+"\n\nProfile Pic=>"+this.loggedUser.INT_PHOTO_CHANGE);
        if(this.userNumberOfMonthsRegistered >= 12 && this.userNumberOfOffers >= 120 && this.userNumberOfGivenRatings >= 30 && this.userNumberOfSponsors >= 8){
            this.updateUserLevel(id, "Lord of the Drink");
            console.log("Lord of the Drink");
        }else if(this.userNumberOfMonthsRegistered >= 9 && this.userNumberOfOffers >=80 && this.userNumberOfGivenRatings >= 20 && this.userNumberOfSponsors >= 5){
            this.updateUserLevel(id, "Ambassadeur");
            console.log("Ambassadeur");
        }else if(this.userNumberOfMonthsRegistered >= 6 && this.userNumberOfOffers >=50 && this.userNumberOfGivenRatings >= 15 && this.userNumberOfSponsors >= 3){
            this.updateUserLevel(id, "Bartender");
            console.log("Bartender");
        }else if(this.userNumberOfMonthsRegistered >= 3 && this.userNumberOfOffers >=30 && this.userNumberOfGivenRatings >= 10 && this.userNumberOfSponsors >= 1){
            this.updateUserLevel(id, "Connaisseur");
            console.log("Connaisseur");
        }else if(this.userNumberOfMonthsRegistered >= 2 && this.userNumberOfOffers >=10 && this.userNumberOfGivenRatings >= 5){
            this.updateUserLevel(id, "Habitué");
            console.log("Habitué");
        }else if(this.userNumberOfMonthsRegistered >= 1 && this.userNumberOfOffers >=5 && this.userNumberOfGivenRatings >= 2 && this.loggedUser.INT_PHOTO_CHANGE === "true"){
            this.updateUserLevel(id, "Petit joueur");
        }else{
            return false;
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

    async vip() {
        const alert = await this.alertCtrl.create({
            header: "V.I.P",
            message: "<h3>Votre statut vous permet de profiter de toutes les offres de Drinks Up.</h3>",
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

    async proprioBar(){
        const alert = await this.alertCtrl.create({
            header: "Propriétaire de bar",
            message: "<h3>Vous êtes bien un partenaire de Drinks Up.</h3>",
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

    async monAbonnementDetail(id, type,debut,fin){
        moment.locale('fr');
        
        const alert = await this.alertCtrl.create({
            header: "Mon abonnement",
            message: "<div class='table'> <div class='col'>Type :</div> <div class='col'>"+type+"</div> <div class='col'>Début :</div> <div class='col'>"+moment(debut).format('LLL')+"</div> <div class='col'>Fin :</div> <div class='col'>"+moment(fin).format('LLL')+"</div></div>",
            cssClass: "alertTables",
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                },
                {
                    text: 'Résilier mon abonnement',
                    cssClass: "btnResilier",
                    handler: () => {
                        //Check Subscription end date
                        var ojd = new Date();
                        // ojd.setDate(ojd.getDate() + 24);
                        var endDate = new Date(this.abonneDetail.ABO_DATEFIN);
                        const diffTime = Math.abs(ojd.getTime() - endDate.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        if(diffDays < 7){
                            this.cannotDisactivate();
                        }else if(this.abonneDetail.ABO_CANCEL === "OUI"){
                            this.alreadyCanceled();
                        }else{
                            this.canDisactivate(id);
                        }
                    }
                }
            ]
        });

        await alert.present();
    }


    //Modals for sponsoring, sharing app and getting sponsored
    async toSponsor(code) {
        const modal = await this.modalCtrl.create( {
            component: ModalToSponsorPage,
            cssClass: "modalFourLinesHeader",
            showBackdrop : true,
            componentProps: {
                codeParam : code
            },
        });
        modal.present();
    }

    async toShare() {
        const modal = await this.modalCtrl.create( {
            component: ModalToSharePage,
            cssClass: "edit-profilepic-modal",
            showBackdrop : true,
            componentProps: {},
        });
        modal.present();
    }

    async getSponsored(code, id) {
        const modal = await this.modalCtrl.create( {
            component: ModalGetSponsoredPage,
            cssClass: "modalThreeLinesHeader",
            showBackdrop : true,
            componentProps: {
                codeParam : code,
                idParam : id
            },
        });
        modal.present();
    }

    //-----------------------------------
    async parrainageInfo(){
        var fixedMonthNum = this.userNumberOfMonthsRegistered.toFixed(1);
        var msg = "<div class='table'> <div class='col xl'>Nombre de personnes parrainées :</div> <div class='col xs'>"+this.userNumberOfSponsors+"</div> <div class='col xl'>Membre depuis (mois) :</div> <div class='col xs'>"+fixedMonthNum+"</div> <div class='col xl'>Nombre d'avis laissés :</div> <div class='col xs'>"+this.userNumberOfGivenRatings+"</div> <div class='col xl'>Nombre d'offre \"profitées\" :</div> <div class='col xs'>"+this.userNumberOfOffers+"</div> </div>";
        const alert = await this.alertCtrl.create({
            header: this.loggedUser.INT_LEVEL,
            message: msg,
            cssClass: "alertTables",
            buttons: [
                {
                    text: "OK",
                    role: "cancel",
                },
                {
                    text: "Plus d'information",
                    handler: () => {
                        this.nativePageTransitions.fade(null); 
                        this.navCtrl.navigateForward('/parrainage');
                    }
                }
            ]
        });

        await alert.present(); 
    }

    async canDisactivate(id){
        const alert = await this.alertCtrl.create({
            header: "Confirmation",
            message: "<h3>Êtes-vous sûr de vouloir résilier votre abonnement ?</h3>",
            buttons: [
                {
                    text: "Oui",
                    handler: () => {
                        this.cancelAbo(id);
                        setTimeout(() => {
                            this.ionViewWillEnter();
                        }, 100);
                    }
                },
                {
                    text: "Non",
                    role: 'cancel'
                }
            ]
        });

        await alert.present(); 
    }

    async cannotDisactivate(){
        const alert = await this.alertCtrl.create({
            header: "Attention !",
            message: "<h3>Vous ne pouvez plus résilier votre abonnement.<br><br>La résiliation doit être faite au moins une semaine avant le terme de votre abonnement. <i style='font-family: NBO; font-size: .8rem'>(Article 5.4 de CGU)</i></h3>",
            buttons: [
                {
                    text: "OK",
                    role: 'cancel'
                }
            ]
        });

        await alert.present(); 
    }

    async alreadyCanceled(){
        const alert = await this.alertCtrl.create({
            header: "Information",
            message: "<h3>Votre abonnement a été déjà résilié.</h3>",
            buttons: [
                {
                    text: "OK",
                    role: 'cancel'
                }
            ]
        });

        await alert.present(); 
    }

    cancelAbo(id){
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'cancelAbo','id' : id},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            console.log("Success message :",data)
        },
        (error: any) => {
            console.log("Error message :",error);
        });
    }
}
        // console.log("Sponsors=>"+this.userNumberOfSponsors+"\n\nMonths=>"+this.userNumberOfMonthsRegistered+"\n\nOffers=>"+this.userNumberOfOffers+"\n\nRatings=>"+this.userNumberOfGivenRatings+"\n\nProfile Pic=>"+this.loggedUser.INT_PHOTO_CHANGE);
