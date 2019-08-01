import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, Platform, ModalController, IonSelect } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import * as moment from 'moment';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ModalChangeUserphotoPage } from '../modal-change-userphoto/modal-change-userphoto.page'
import { LoadingpagePage } from '../loadingpage/loadingpage.page'
import * as Global from '../../app/global';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    @ViewChild(IonSelect) selectRef: IonSelect;
    customActionSheetOptions: any = {
        header: 'Sélectionnez votre ville préférée.',
        subHeader: 'Cette option vous permettra de filtrer les Top 10 bars de Drinks Up.'
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
    constructor(private modalCtrl : ModalController,private emailComposer: EmailComposer, private googlePlus : GooglePlus, private route: Router, public navCtrl : NavController, public storage: Storage, private http : HttpClient, private platform : Platform) {
        // setTimeout(() => {
        //     this.loadSlide = "translateX(160px)";
        // }, 1000);
        setTimeout(() => {
            this.loadHeight = "0%";
        }, 1000);
    }
    ngOnInit() {}

    ionViewWillEnter(){
        this.getVille();
        moment.locale('fr');

        this.storage.get('SessionIdKey').then((val) => {
            this.loadData(val);
            this.getPaidUser(val);
            this.getDetailAbonnement(val);
        });        
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

    monAbonnement(){
        document.getElementById("bckdrop").style.display = "block";
        document.getElementById("cmw").style.display = "flex";
        document.getElementById("cm").style.display = "block";
    }

    closeModal(){
        document.getElementById("bckdrop").style.display = "none";
        document.getElementById("cmw").style.display = "none";
        document.getElementById("cm").style.display = "none";
    }

    getDetailAbonnement(id : string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getDetailAbonnement', 'idUser': id},
            url: any      	= this.baseURI;
      
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

                var newStart = new Date(data.ABO_DATEDEBUT).toISOString();
                var newEnd = new Date(data.ABO_DATEFIN).toISOString();
                data.ABO_DATEDEBUT = newStart;
                data.ABO_DATEFIN= newEnd;
                this.abonneDetail = data;

              console.log("abonne detail ======>", this.abonneDetail)
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

}
