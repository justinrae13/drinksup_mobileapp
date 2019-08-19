import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertController, IonItemSliding, ModalController, ToastController, NavController} from '@ionic/angular';
import {OffersAddbarPage} from '../offers-addbar/offers-addbar.page';
import {CalendarComponent} from 'ionic2-calendar/calendar';
import {DatePipe, formatDate} from '@angular/common';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';


@Component({
  selector: 'app-offers-management',
  templateUrl: './offers-management.page.html',
  styleUrls: ['./offers-management.page.scss'],
  providers: [DatePipe]
})
export class OffersManagementPage implements OnInit {
    event = {
        title: '',
        description: '',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        entreprise: '',
        idOffre: '',
        actif: '',
        allDay: false
    };
    minDate = new Date().toISOString();
    eventSource = [];
    calendar = {
        mode: 'month',
        currentDate: new Date()
    }
    viewTitle = '';
    entValid : string = "";
    usersFilter = [];
    listeOffres = [];
    public baseURI = Global.mainURI;
    offres = {
        title: '',
        description: '',
        startTime: new Date(),
        endTime: new Date(),
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
    
    ojd = new Date();
    @ViewChild(CalendarComponent) myCal: CalendarComponent;
    constructor(public dp: DatePipe, public alertCtrl: AlertController, @Inject(LOCALE_ID)private locale: string, public http: HttpClient, public toastCtrl: ToastController, public alertController: AlertController, public storage: Storage, public navCtrl : NavController) { }
    ngOnInit() {

    }

    public ionViewWillEnter(): void {
        this.resetEvents();
        this.eventSource = [];
        
        this.storage.get('SessionIdKey').then((val) => {
            this.getProprio(val);
        });
        this.disactivateAllPassedOffers();
    }

    resetEvents() {
        this.event = {
            title: '',
            description: '',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
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
                    startTime: new Date(this.listeOffres[i].startTime),
                    endTime: new Date(this.listeOffres[i].endTime),
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
            startTime: new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            entreprise: this.event.entreprise,
            idOffre: this.event.idOffre,
            actif: 'Non',
            allDay: this.event.allDay
        }
        const dateDebut = this.dp.transform(eventCopy.startTime, 'yyyy-MM-dd HH:mm', 'GMT+0000');
        const dateFin = this.dp.transform(eventCopy.endTime, 'yyyy-MM-dd  HH:mm', 'GMT+0000');
        this.addOffer(eventCopy.description, dateDebut, dateFin,eventCopy.actif, eventCopy.title);
        this.eventSource.push(eventCopy);
        this.ionViewWillEnter();

    }

    addEventError(){
        const start = new Date(this.event.startTime).toISOString();
        const end = new Date(this.event.endTime).toISOString();

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
                console.log(idEnt)
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
        this.calendar.currentDate = new Date();
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
        const selected = new Date(ev.selectedTime);
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
            header: 'Êtes vous sûr de vouloir supprimer l\'offre : ' + nom,
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
            header: 'Le status de votre bar est acuellement inactif. Vous ne pouvez pas ajouter une offre.',
            buttons: [
                {
                    text: 'Ok',
                    handler: () => {
                        this.navCtrl.navigateForward("/tabsproprio/qrcode");
                    }
                }
            ]
        });

        await alert.present();
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
