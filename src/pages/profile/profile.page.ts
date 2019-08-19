import { ToastController, AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, Platform, ModalController, IonSelect } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as moment from 'moment';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ModalChangeUserphotoPage } from '../modal-change-userphoto/modal-change-userphoto.page'
import { LoadingpagePage } from '../loadingpage/loadingpage.page'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import * as Global from '../../app/global';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
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
    data: any;
    dateInscription = '';
    loadHeight : string = "100%";
    loadSlide : string = "translateX(0px)";
    idInternaute: number;
    allVille = [];
    abonneDetail = {};
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
    constructor(private nativePageTransitions: NativePageTransitions, private clipboard: Clipboard, private socialSharing: SocialSharing, public alertCtrl: AlertController, private toastCtrl : ToastController,private modalCtrl : ModalController,private emailComposer: EmailComposer,private fb: Facebook, private googlePlus : GooglePlus, private route: Router, public navCtrl : NavController, public storage: Storage, private http : HttpClient, private platform : Platform) {

        setTimeout(() => {
            this.curtain_fade = "0";
        }, 1000);
        setTimeout(() => {
            this.curtain_hide = "none";
        }, 1600);

        // let btn = document.getElementById("alert_button");
        // btn.addEventListener("click", (e:Event) => this.copyMyCode());
        
    }
    ngOnInit() {}

    ionViewWillEnter(){
        this.getVille();
        moment.locale('fr');
        this.storage.get('SessionIdKey').then((val) => {
            this.loadData(val);
            this.getPaidUser(val);
            this.getDetailAbonnement(val);
            this.getUserNumOffers(parseInt(val));
            this.getUserNumRatings(parseInt(val));
            
        });
         
        setTimeout(() => {
            
        }, 500);
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
        this.googlePlus.logout().then(res => {console.log(res);}).catch(err => console.error(err));
        this.fb.logout();
        this.navCtrl.navigateRoot('login');
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

    goAbonnement(){
        this.navTabs('/abonnement');
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
            this.updateUserLevel(id, "Expert/Bartender");
            console.log("Expert/Bartender");
        }else if(this.userNumberOfMonthsRegistered >= 3 && this.userNumberOfOffers >=30 && this.userNumberOfGivenRatings >= 10 && this.userNumberOfSponsors >= 1){
            this.updateUserLevel(id, "Connaisseur");
            console.log("Connaisseur");
        }else if(this.userNumberOfMonthsRegistered >= 2 && this.userNumberOfOffers >=10 && this.userNumberOfGivenRatings >= 5){
            this.updateUserLevel(id, "Habitué/Confirmé");
            console.log("Habitué/Confirmé");
        }else if(this.userNumberOfMonthsRegistered >= 1 && this.userNumberOfOffers >=5 && this.userNumberOfGivenRatings >= 2 && this.loggedUser.INT_PHOTO_CHANGE === "true"){
            this.updateUserLevel(id, "Initié/Petit joueur");
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

    //Custom modals
    parrainer(role : string, user_code : string){
        document.getElementById("bckdrop").style.display = "block";
        document.getElementById("pm").style.display = "block";

        var header_text = "";
        var body_text = "";
        var btn_text = "";
        if(role==="user"){
            header_text = "Vous pouvez soit copier votre code et l'envoyer à vos amis ou vous pouvez tout simplement cliquer sur le bouton \"Parrainer\".";
            body_text = "<div style='display:flex; justify-content:center; align-items:center; overflow:hidden;height: 60px;border-radius: 5px 5px 0px 0px; position: relative; background-color: rgba(0,0,0,.6); border: 1px solid rgba(255,255,255,.6)'><p style='border-radius:0 0 5px 0;margin: 0; background: rgba(255,255,255,.6);display: inline; font-size: .7em;font-family: NBO; position: absolute;top: 0;left: 0; padding: 2px 15px'>VOTRE CODE</p><h1 style='margin: 0; color: rgba(255,255,255,.7);font-size: 1rem; font-family: NBL; margin-top: 12px'>"+user_code+"</h1></div>";
            btn_text = "Parrainer";
            document.getElementById("pm_copy_btn").style.display = "block";
        }else{
            header_text = "Partager Drinks Up";
            body_text = "<h3 style='margin: 0; color: rgba(255,255,255,.7);font-size: .9rem; font-family: NBL'>Partager l'application avec vos proches et vos amis.</h3>";
            btn_text = "Partager";
            document.getElementById("pm_copy_btn").style.display = "none";
    }

        document.getElementById("pm_header_text").innerHTML = header_text;
        document.getElementById("pm_body_text").innerHTML = body_text;
        document.getElementById("pm_btn_text").innerHTML = btn_text;
    }

    saisirCode(){
        document.getElementById("bckdrop").style.display = "block";
        document.getElementById("scm").style.display = "block";
        this.the_pasted_code = "- - - - - - -";   
    }

    monAbonnement(){
        document.getElementById("bckdrop").style.display = "block";
        document.getElementById("cm").style.display = "block";
    }

    closeModal(){
        document.getElementById("bckdrop").style.display = "none";
        document.getElementById("cm").style.display = "none";
        document.getElementById("pm").style.display = "none";
        document.getElementById("scm").style.display = "none";
    }

    shareCode(role){
        var subject = "Drinks Up application mobile (Android/IOS)";
        var message = "";
        if(role===2){
            message = "Télécharger Drinks Up dès maintenant ! \n\n Android : https://drinksup.ch \n IOS : https://drinksup.ch";
        }else{
            message = "Télécharger Drinks Up dès maintenant ! \n\n Android : https://drinksup.ch \n IOS : https://drinksup.ch \n\nOublies pas de saisir mon code via l'appli : "+this.the_copied_code+"\n\nTu peux soit copier le message en entier ou copier juste le code et le coller dans la section \"As-tu un code?\".";
        }
        this.socialSharing.share(message,subject,null,null).then((data) => {
          }).catch((error) => {
            console.log(error);
        });
    }

    copyMyCode(){
        this.clipboard.copy(this.the_copied_code);
        this.sendNotification("Copié !");
        this.closeModal();
    }

    pasteTheCode(myId){
        var check = "";
        var clipBoardMsg = "";
        var txt = "";
        var nowhitespaces = "";

        this.clipboard.paste().then(
            (resolve: string) => {
                clipBoardMsg = resolve;

                //Condition
                check = clipBoardMsg.substring(0,3);
                if(check==="DU-"){
                    this.the_pasted_code = clipBoardMsg.replace(/\s/g,'');
                    //
                    this.checkIfCodeExists(clipBoardMsg.replace(/\s/g,''));
                    this.checkIfAlreadySponsored(clipBoardMsg.replace(/\s/g,''), myId);

                }else if(check==="Tél"){
                    clipBoardMsg = clipBoardMsg.split("l'appli : ").pop();
                    txt = clipBoardMsg.split('Tu peux').shift();
                    nowhitespaces = txt.replace(/\s/g,'');

                    this.the_pasted_code = nowhitespaces;
                    //
                    this.checkIfCodeExists(nowhitespaces);
                    this.checkIfAlreadySponsored(nowhitespaces, myId);
                }else{
                    this.sendNotification("Veuillez assurer que vous avez copié message en entier ou le bon code.");
                }

             },
             (reject: string) => {
               console.log('Error: ' + reject);
             }
        );
    }

    saveCode(myCode, myId){
        if(myCode === this.the_pasted_code){
            this.sendNotification("Vous ne pouvez utiliser votre propre code !");
        }else if(!this.the_code_exists){
            this.sendNotification("Le code est invalide. Veuillez vérifier si vous avez bien saisi le bon code.");
        }else if(this.the_pasted_code === "- - - - - - -"){
            this.sendNotification("Le code est invalide. Veuillez vérifier si vous avez bien saisi le bon code.");
        }else if(this.the_code_exists ){
            if(!this.if_already_sponsored){
                this.addSponsorship(this.the_pasted_code, myId);
                this.sendNotification("Succès !");
                setTimeout(() => {
                    this.closeModal();
                }, 1000);
            }else{
                this.sendNotification("Erreur !\nVous avez déjà utilisé le code de cet utilisateur.");
            }
        }else{
            return false;
        }
    }

    addSponsorship(code_of_sponsor : string, id_of_sponsored : number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'addSponsorship', 'code': code_of_sponsor, 'id' : id_of_sponsored},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            console.log(data)
        },  
        (error: any) => {
            console.log(error);
        });
    }

    checkIfCodeExists(code : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'checkIfCodeExists', 'code': code},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            if(data.num > 0){
                this.the_code_exists = true;
            }else{
                this.the_code_exists = false;
            }
        },  
        (error: any) => {
            console.log(error);
        });
    }

    checkIfAlreadySponsored(code_of_sponsor : string, id_of_sponsored : number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'checkIfAlreadySponsored', 'code': code_of_sponsor, 'id' : id_of_sponsored},
            url: any      	= this.baseURI;
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            if(data.num > 0){
                this.if_already_sponsored = true;
            }else{
                this.if_already_sponsored = false;
            }
        },  
        (error: any) => {
            console.log(error);
        });
    }

    parrainageInfo(){
        this.nativePageTransitions.fade(null); 
        this.navCtrl.navigateForward('/parrainage');
    }

}
