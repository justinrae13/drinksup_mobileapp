import { Component, OnInit } from '@angular/core';
import {NavController, ToastController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';
import {Storage} from '@ionic/storage';
import * as Global from '../../app/global';

@Component({
    selector: 'app-abonnement',
    templateUrl: './abonnement.page.html',
    styleUrls: ['./abonnement.page.scss'],
})
export class AbonnementPage implements OnInit {
    fcolor1 : string;
    fcolor2 : string;
    fcolor3 : string;
    amount: string;
    couleur: string;
    couleur2: string;
    couleur3: string;
    offre: string;
    offre2: string;
    offre3: string;
    type: string;
    loggedUser: any = {};
    baseURI = Global.mainURI;
    data: any;
    idInternaute: number;
    public paiementForm: FormGroup;
    constructor(private formBuilder: FormBuilder, public storage: Storage,  public http: HttpClient, public navCtrl: NavController, private toastCtrl: ToastController) {
        this.paiementForm = new FormGroup({
            cardNumber: new FormControl(),
            cardMonth: new FormControl(),
            cardYear: new FormControl(),
            cardCVV: new FormControl(),
        });
        this.validationForm();
    }
    validationForm() {
        this.paiementForm = this.formBuilder.group({
            'cardNumber' : ['', Validators.compose([Validators.maxLength(16), Validators.minLength(16), Validators.pattern('^[0-9]*$'), Validators.required])],
            'cardMonth' : ['', Validators.compose([Validators.maxLength(2), Validators.minLength(2), Validators.pattern('^[0-9]*$'), Validators.required])],
            'cardYear' : ['', Validators.compose([Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$'), Validators.required])],
            'cardCVV' : ['', Validators.compose([Validators.maxLength(3), Validators.minLength(3), Validators.pattern('^[0-9]*$'), Validators.required])],
        });
    }
    ionViewWillEnter(){
        this.storage.get('SessionIdKey').then((val) => {
            this.loadData(val);
        });

    }
    ngOnInit() {
    }


    loadData(idSession : string){
        let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
            options 	: any		= {"key" : "getUsersById", "idSession" : idSession},
            url       : any   = this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
            {
                this.loggedUser = data;
                this.idInternaute = this.loggedUser.INT_ID;
            },
            (error : any) =>
            {
                console.dir(error);
            });
    }
    validateCard() {
        const  cardNumber: string = this.paiementForm.controls['cardNumber'].value;
        const  cardMonth: string = this.paiementForm.controls['cardMonth'].value;
        const  cardYear: string = this.paiementForm.controls['cardYear'].value;
        const  cardCVV: string = this.paiementForm.controls['cardCVV'].value;
        if(this.offre === undefined && this.offre2 === undefined){
            this.type = 'Annuel';
            this.addOffre(cardNumber, cardMonth, cardYear, cardCVV, this.offre3, this.type, this.idInternaute);
        }else if (this.offre2 === undefined && this.offre3 === undefined) {
            this.type = 'Mensuel';
            this.addOffre(cardNumber, cardMonth, cardYear, cardCVV, this.offre, this.type, this.idInternaute);
        }else {
            this.type = 'Trimestriel';
            this.addOffre(cardNumber, cardMonth, cardYear, cardCVV, this.offre2, this.type, this.idInternaute);
        }
    }
    addOffre(cardNumber: string, cardMonth: string, cardYear: string, cardCVV: string, amount: string, type: string, idInt: number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'addAbo', 'cardNumber': cardNumber, 'cardMonth': cardMonth, 'cardYear': cardYear, 'cardCVV': cardCVV, 'amount' : amount, 'type' : type, 'idInt' : idInt},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.sendNotification('Votre paiement a bien été pris en compte');
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur! Echec du paiement');
            });
    }
    async sendNotification(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    offer() {
        this.fcolor1 = 'black';
        this.fcolor2 = '';
        this.fcolor3 = '';
        this.couleur = '#fff';
        this.couleur2 = '';
        this.couleur3 = '';
        this.offre = '9.90';
        console.log(this.offre);
    }
    offer2() {
        this.fcolor1 = '';
        this.fcolor2 = 'black';
        this.fcolor3 = '';
        this.couleur = '';
        this.couleur2 = '#fff';
        this.couleur3 = '';
        this.offre2 = '19.90';
        console.log(this.offre2);
    }
    offer3() {
        this.fcolor1 = '';
        this.fcolor2 = '';
        this.fcolor3 = 'black';
        this.couleur = '';
        this.couleur2 = '';
        this.couleur3 = '#fff';
        this.offre3 = '59.90';
        console.log(this.offre3);
    }

    retour(){
        this.navCtrl.back();
    }


}