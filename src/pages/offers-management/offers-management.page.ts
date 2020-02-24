import {Component, Inject, LOCALE_ID, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertController, IonItemSliding, ToastController, NavController, IonContent} from '@ionic/angular';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {DatePipe, formatDate} from '@angular/common';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';
import * as moment from 'moment';


@Component({
  selector: 'app-offers-management',
  templateUrl: './offers-management.page.html',
  styleUrls: ['./offers-management.page.scss'],
  providers: [DatePipe]
})
export class OffersManagementPage{
  sendnotifURL = 'https://www.drinksup.ch/serveur/mailer/sendnotif.php';
  event = {
        title: '',
        description: '',
        startTime: moment().toDate().toISOString(),
        endTime: moment().toDate().toISOString(),
        entreprise: '',
        idOffre: '',
        actif: '',
        allDay: false
    };
    minDate = moment().toDate().toISOString();
    eventSource = [];
    calendar = {
        mode: 'month',
        currentDate: moment().toDate()
    }
    viewTitle = '';
    entValid : string = "";
    usersFilter = [];
    listeOffres = [];
    public baseURI = Global.mainURI;
    offres = {
        title: '',
        description: '',
        startTime: moment().toDate(),
        endTime: moment().toDate(),
        entreprise: '',
        idOffre: '',
        actif: '',
        allDay: false
    };
    loggedEnt : any = {};
    invalidColor : string = "gray";
    validColor : string = "#4caf50";
    mostInvalidColor: string = "#505050";
    entreprise_id : string = "";
    barname : string;
    
    ojd = moment().toDate();

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

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

    constructor(public dp: DatePipe, public alertCtrl: AlertController, @Inject(LOCALE_ID)private locale: string, public http: HttpClient, public toastCtrl: ToastController, public alertController: AlertController, public storage: Storage, public navCtrl : NavController) { }
    
    public ionViewWillEnter(): void {
        this.resetEvents();
        this.eventSource = [];
        
        this.storage.get('SessionIdKey').then((val) => {
            this.getProprio(val);
        });
        this.disactivateAllPassedOffers();

        //Check if user has internet connection
        if(navigator.onLine){
            //If user has connection
            this.ifHasConnection = true;
        }else{
            //If user has no connection
            this.ifHasConnection = false;
        }
    }

    resetEvents() {
        this.event = {
            title: '',
            description: '',
            startTime: moment().toDate().toISOString(),
            endTime: moment().toDate().toISOString(),
            entreprise: '',
            idOffre: '',
            actif: '',
            allDay: false
        };
    }

    public getProprio(id) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getProprioValide', 'id_user' : id},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.loggedEnt = data;
            this.entreprise_id = this.loggedEnt.ENT_ID;
            this.barname = this.loggedEnt.ENT_NOM;
            this.getOffres(this.loggedEnt.ENT_ID);
            if(this.loggedEnt.ENT_VALIDATION == "Non"){
                this.activeBar();
            }else{
                return false;
            }
        });

    }
    getOffres(idEntreprise) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getOffres', 'id_ent_parm' : idEntreprise},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.listeOffres = data;
            for (let i = 0; i < this.listeOffres.length; i++) {
                this.offres = {
                    title: this.listeOffres[i].title.toString(),
                    description: this.listeOffres[i].description.toString(),
                    startTime: moment(this.listeOffres[i].startTime).toDate(),
                    endTime: moment(this.listeOffres[i].endTime).toDate(),
                    entreprise: this.listeOffres[i].entreprise,
                    idOffre: this.listeOffres[i].idOffre,
                    actif: this.listeOffres[i].actif,
                    allDay: false
                }
                this.eventSource.push(this.offres);
            }
            this.myCal.loadEvents();
        });
    }

    addEvent() {
        const eventCopy = {
            title: this.entreprise_id,
            description: this.event.description,
            startTime: moment(this.event.startTime).toDate(),
            endTime: moment(this.event.endTime).toDate(),
            entreprise: this.event.entreprise,
            idOffre: this.event.idOffre,
            actif: 'Non',
            allDay: this.event.allDay
        }
        const dateDebut = this.dp.transform(eventCopy.startTime, 'yyyy-MM-dd HH:mm', 'GMT+0000');
        const dateFin = this.dp.transform(eventCopy.endTime, 'yyyy-MM-dd  HH:mm', 'GMT+0000');
        const capitalizeDesc = eventCopy.description.charAt(0).toUpperCase()+eventCopy.description.substring(1);
        // console.log("Date de debut =>",dateDebut);
        var ojd = moment().toDate();
        var startOffer = moment(dateDebut).toDate();
        if(startOffer<ojd){
            this.sendNotification("La date et heure de début ne peut pas être inférieure à la date et heure d'aujourd'hui !");
        }else{
            this.addOffer(capitalizeDesc, dateDebut, dateFin,eventCopy.actif, eventCopy.title);
            this.eventSource.push(eventCopy);
            this.ionViewWillEnter();
        }  
    }

    addEventError(){
        const start = moment(this.event.startTime).toDate().toISOString();
        const end = moment(this.event.endTime).toDate().toISOString();

        if(start>end){
            this.sendNotification("La date de début doit être inférieure à la date de fin !")
        }else if(this.event.description==""){
            this.sendNotification("Saisissez la description de l'offre !")
        }else{
            this.sendNotification("Tous les champs sont obligatoires !")
        }
    }

    addOffer(description: String, dateDebut: String, dateFin: String, actif: String, idEnt: String) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'insertOffers', 'description': description, 'dateDebut': dateDebut, 'dateFin': dateFin, 'actif': actif, 'idEnt': idEnt},
            url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.sendNotification('L\'ajout de l\'offre a bien été pris en compte!');
                this.myCal.loadEvents();
                console.log(idEnt);
                console.log("Méthode d'ajout d'offre à été déclanchée !")
                this.sendNotifToAdmin("Ajout d'une nouvelle offre", this.barname);
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }

    disactivateAllPassedOffers() {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'disactivateAllPassedOffers'},
            url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                console.log("nice =>", data)
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
    }


    changeMode(mode) {
        this.calendar.mode = mode;
    }

    back() {
        const swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slidePrev();
    }

    next() {
        const swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slideNext();
    }
    today() {
        this.calendar.currentDate = moment().toDate();
    }
    async eventSelected(event) {
        const start = formatDate(event.startTime, 'dd/MM/yyyy HH:mm', this.locale);
        const end = formatDate(event.endTime, 'dd/MM/yyyy HH:mm', this.locale);

        var status = event.actif;
        var txt = "";
        if(status === "Non" && event.endTime > this.ojd){
            txt = "Cette offre est à ce moment <span style='color: rgb(196,0,0)'> inactive.</span>"
        }else if(status === "Non" && event.endTime < this.ojd){
            txt = "La date de fin de cette offre est déjà <span style='color: #e59400'> dépassée.</span> <br> Vous pouvez la suprimmer si vous le souhaiter."
        }else{
            txt = "Cette offre est <span style='color: #4caf50'> active.</span>"
        }

        const alert = await this.alertCtrl.create({
            header: "L'offre : "+event.description,
            message: "<h3 style='font-family : NBO !important; font-size: .9em !important'> De "+start+"<br><br>à "+end+"</h3> <p style='font-style: italic'>"+txt+"</p>",
            // message: 'De : ' + start + '<br>à ' + end,
            buttons: ['OK']
        });
        alert.present();
    }
    
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onTimeSelected(ev) {
        const selected = moment(ev.selectedTime).toDate();
        this.event.startTime = selected.toISOString();
        selected.setHours(selected.getHours() + 1);
        this.event.endTime = (selected.toISOString());
    }

    async delete(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        console.log('id de l\'offre ' + id);
        this.presentAlert(id, nom);
    }

    async edit(slidingItem: IonItemSliding, id, actif, nom, description){
        await slidingItem.close();
        const nactif = '';
        if(actif === 'Oui'){
            const inactif = 'Non';
            const header = 'Voulez-vous désactiver l\'offre de ' + nom + ' description de l\'offre : ' + description;
            console.log(header + '----> ' + inactif);
            this.presentAlertActif(id, inactif, header);
        }else {
            const activer = 'Oui';
            const header = 'Voulez-vous activer l\'offre de ' + nom + ' description de l\'offre : ' + description;
            console.log(header + '----> ' + activer);
            this.presentAlertActif(id, activer, header);
        }

    }
    deleteOffre(id: number) {
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

    editOffre(id: number, actif: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'editOffre', 'id': id, 'actif': actif},
            url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.sendNotification('Votre Modification a bien été pris en compte !');
                console.log('ouais bien');
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }
    async presentAlert(id, nom) {
        const alert = await this.alertController.create({
            header: "Confirmation",
            message: "<h3>Êtes vous sûr de vouloir supprimer l'offre : " + nom + "</h3>",
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
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

    async presentAlertActif(id, actif, header) {
        const alert = await this.alertController.create({
            header: header,
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Oui',
                    handler: () => {
                        this.editOffre(id, actif);
                        this.ionViewWillEnter();
                        console.log('Confirm Okay ' + actif + ' ' + id);
                    }
                }
            ]
        });

        await alert.present();
    }

    async activeBar() {
        const alert = await this.alertController.create({
            header: "Alerte !",
            message: "<h3>Le status de votre bar est acuellement inactif. Vous ne pouvez pas ajouter une offre.</h3>",
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.navigateForward("/tabsproprio/qrcode");
                    }
                }
            ]
        });

        await alert.present();

        alert.onDidDismiss().then(() => {
            this.navCtrl.navigateForward("/tabsproprio/qrcode");            
        });
    }
    async sendNotification(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 4000,
            position: 'top'
        });
        toast.present();
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

    sendNotifToAdmin(title, barname) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'title' : title, 'barname' : barname, 'nametype' : 'Nom du bar'},
            url: any      	= this.sendnotifURL;
    
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            console.log(data);
            if(data == "Sent"){
                this.sendNotification("Une notification a été envoyé à l'administrateur");
            }else{
                console.log("Erreur d'envoi de notification");
            }
        },
        (error: any) => {
            console.log(error);
        });
    }
    
}
