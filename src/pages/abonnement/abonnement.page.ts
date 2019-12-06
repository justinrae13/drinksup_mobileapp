import { element } from 'protractor';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Component, enableProdMode } from '@angular/core';
import { NavController, ToastController, ModalController, AlertController } from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as moment from 'moment';
import {Storage} from '@ionic/storage';
import * as Global from '../../app/global';
import { TouchSequence } from 'selenium-webdriver';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

const unMois = "ch.drinksup.app.DrinksupUnMois";
const troisMois = "ch.drinksup.app.DrinksupTroisMois";
const sixMois = "ch.drinksup.app.DrinksupSixMois";
const douzeMois = "ch.drinksup.app.DrinksupDouzeMois";






@Component({
    selector: 'app-abonnement',
    templateUrl: './abonnement.page.html',
    styleUrls: ['./abonnement.page.scss'],
})
export class AbonnementPage{
    fcolor1 : string;
    fcolor2 : string;
    fcolor3 : string;
    amount: string;
    type: string;
    loggedUser: any = {};
    baseURI = Global.mainURI;
    data: any;
    idInternaute: number;
    nameInternaute : string = null;
    emailInternaute : string = null;
    ifHasBeenSubscribed : number = null;
    public paiementForm: FormGroup;

    //Animations
    abonneCardClicked : boolean = false;

    sectHeight : string = "calc(100% - 85px)";

    height1 : string = "calc((100% - 32px) / 4)";
    height2 : string = "calc((100% - 32px) / 4)";
    height3 : string = "calc((100% - 32px) / 4)";
    height4 : string = "calc((100% - 32px) / 4)";

    display1 : string = "flex";
    display2 : string = "flex";
    display3 : string = "flex";
    display4 : string = "flex";

    opac1 : string = "1";
    opac2 : string = "1";
    opac3 : string = "1";
    opac4 : string = "1";

    formTitlePop : string = "none";
    formPop : string = "none";
    mdPaimentTitlePop : string = "none";
    mdPaimentPop : string = "none";
    //Credit Cards
    cc : string = "block";
    amex : string = "none";
    diner : string = "none";
    jcb : string = "none";
    visa : string = "none";
    mcard : string = "none";

    //
    cbCheckedValidation : boolean = false;
    cbClicked : boolean = false;

    //
    typeAbo : string = null;
    montantAbo : string = null;

    //In-app-purchase abonnements
    abonnements : any = [];

    constructor(private iap : InAppPurchase, private payPal: PayPal, private modalCtrl : ModalController, private formBuilder: FormBuilder, public storage: Storage,  public http: HttpClient, public navCtrl: NavController, private alertCtrl: AlertController , private toastCtrl: ToastController) {
        this.paiementForm = new FormGroup({
            cardNumber: new FormControl(),
            cardMonth: new FormControl(),
            cardYear: new FormControl(),
            cardCVV: new FormControl()
        });
        this.validationForm();
    }

    subscribeToDrinksUp(){
        alert("No payment needed !")
    }

    ionViewWillEnter() : void{
        this.storage.get('SessionIdKey').then((val) => {
            this.loadData(val);
            this.hasBeenSubscribed(val);
        });

        this.iap.getProducts([unMois, troisMois, sixMois, douzeMois]).then((products) => {
            console.log("Our products =>",products);
            this.abonnements = products;
        }).catch((err) => {
            console.log(err);
        });
    }

    validationForm() {
        this.paiementForm = this.formBuilder.group({
            'cardNumber' : ['', Validators.compose([Validators.maxLength(19), Validators.minLength(19), Validators.pattern('^[0-9 ]*$'), Validators.required])],
            'cardMonth' : ['', Validators.compose([Validators.maxLength(2), Validators.minLength(2), Validators.pattern('^[0-9]*$'), Validators.required])],
            'cardYear' : ['', Validators.compose([Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$'), Validators.required])],
            'cardCVV' : ['', Validators.compose([Validators.maxLength(3), Validators.minLength(3), Validators.pattern('^[0-9]*$'), Validators.required])]
        });
    }

    

    hasBeenSubscribed(idSession : number){
        let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "hasBeenSubscribed", "idSession" : idSession},
        url       : any   = this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
            {
                this.ifHasBeenSubscribed = data.num;
            },
            (error : any) =>
            {
                console.dir(error);
            });
    }

    loadData(idSession : string){
        let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
            options 	: any		= {"key" : "getUsersById", "idSession" : idSession},
            url       : any   = this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
            {
                this.loggedUser = data;
                this.idInternaute = this.loggedUser.INT_ID;
                this.nameInternaute = this.loggedUser.INT_PRENOM;
                this.emailInternaute = this.loggedUser.INT_EMAIL;
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

        let noSpaceCardNo = cardNumber.split(" ").join("");

        console.log("Card Number : "+noSpaceCardNo+"\n\nType : "+this.typeAbo+"\n\nPrice : "+this.montantAbo)

        if(this.typeAbo !== null && this.montantAbo !== null && this.cbCheckedValidation){
            this.addOffre(cardNumber, cardMonth, cardYear, cardCVV, this.montantAbo, this.typeAbo, this.idInternaute, this.nameInternaute, this.ifHasBeenSubscribed, this.emailInternaute);
        }else if(!this.cbCheckedValidation){
            this.sendNotification("Veuillez cocher la case pour accepter les conditions générales d'utilisation.");
        }else{
            this.sendNotification("Veuillez choisir le type d'abonnement.");
        }
    }

    addOffre(cardNumber: string, cardMonth: string, cardYear: string, cardCVV: string, amount: string, type: string, idInt: number, nameInt : string, ifSubbed : number, emailInt : string) {
        var whichQuery = "";
        if( ifSubbed > 0){
            whichQuery = "Update";
        }else{
            whichQuery = "Add";
        }

        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'addAbo', 'cardNumber': cardNumber, 'cardMonth': cardMonth, 'cardYear': cardYear, 'cardCVV': cardCVV, 'amount' : amount, 'type' : type, 'idInt' : idInt, 'whichQuery' : whichQuery, 'nameInt' : nameInt, 'emailInt' : emailInt},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.alertPayment(data.message);
            },
            (error: any) => {
                console.log(error);
                this.notifLong('Erreur de paiement !\nAssurez-vous que toutes les informations sont identiques à celles figurant sur votre carte.');
            });
    }

    async alertPayment(msg){
        var img = "";
        if(msg === "new"){
            img = "<img src='../../assets/img/toast_new.svg'/>"
        }else{
            img = "<img src='../../assets/img/toast_renew.svg'/>"
        }
        const alert = await this.alertCtrl.create({
            message: img,
            cssClass : "popUpDebut",
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.modalCtrl.dismiss("paymentDone");
                    }
                },
            ]
        });
    
        await alert.present();
    }

    paymentWithPaypal(){
        this.payPal.init({
            PayPalEnvironmentProduction: 'AWp08CAc1j1GXCsna8lbIvc445sj_rnxTqUte1zurdt_inowYW44SAkWWVKtfkFNmE5CzB4e47RQ5F5N',
            PayPalEnvironmentSandbox: 'AWp08CAc1j1GXCsna8lbIvc445sj_rnxTqUte1zurdt_inowYW44SAkWWVKtfkFNmE5CzB4e47RQ5F5N'
          }).then(() => {
            // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
            this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
              // Only needed if you get an "Internal Service Error" after PayPal login!
              //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
            })).then(() => {
              let payment = new PayPalPayment(this.montantAbo, 'CHF', 'Abonnement de '+this.typeAbo, 'sale');
              this.payPal.renderSinglePaymentUI(payment).then(() => {
                // Successfully paid
                this.addOrUpdatePaypal(this.montantAbo, this.typeAbo, this.idInternaute, this.nameInternaute, this.ifHasBeenSubscribed, this.emailInternaute)
              }, (error) => {
                // Error or render dialog closed without being successful
                // alert("Render dialog closed without being successful => " + error);
                });
            }, (error) => {
              // Error in configuration
            //   alert("Error in configuration paypal => " + error);
            });
          }, (error) => {
            // Error in initialization, maybe PayPal isn't supported or something else
            // alert("Error in initialization, PayPal isn't supported => " + error);
        });
    }

    addOrUpdatePaypal(amount: string, type: string, idInt: number, nameInt : string, ifSubbed : number, emailInt : string){
        var whichQuery = "";
        if( ifSubbed > 0){
            whichQuery = "Update";
        }else{
            whichQuery = "Add";
        }
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'addAboViaPaypal', 'amount' : amount, 'type' : type, 'idInt' : idInt, 'whichQuery' : whichQuery, 'nameInt' : nameInt, 'emailInt' : emailInt},
        url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.alertPayment(data);
        },
        (error: any) => {
            console.log(error);
            this.notifLong('Erreur de paiement !\nSolde insuffisant ou transaction refusée. Veuillez réessayer ultérieurement ou réessayer avec un autre moyen de paiement');
        });
    }

    async sendNotification(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }

    async notifLong(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 5000,
            position: 'top'
        });
        toast.present();
    }

    async goToCgu(){
        const alert = await this.alertCtrl.create({
            header: "Confirmation",
            message: "<h3>Aller sur la page Conditions Générales d'Utilisation ?</h3>",
            cssClass : "dimBackdropAlert",
            buttons: [
                {
                    text: 'Oui',
                    cssClass: 'secondary',
                    handler: () => {
                        this.navCtrl.navigateForward('/cgu');
                        this.modalCtrl.dismiss("back");
                    }
                },
                {
                    text: 'Non',
                    role: 'cancel',
                    cssClass: 'secondary',
                }
            ]
        });

        await alert.present();
    }

    retour(){
        this.modalCtrl.dismiss("back");
    }

    cbChecked(e){
      this.cbCheckedValidation = e.currentTarget.checked;
    }

    typeDabo(num : number){

        if(!this.abonneCardClicked){
            setTimeout(() => {
                this.mdPaimentPop = "block";
                this.mdPaimentTitlePop = "block";
            },600);
            if(num === 1){
                document.getElementById("h1Top").innerText = "Vous avez choisi l'abonnement de 1 mois."
                //Price and type
                this.typeAbo = "1 mois";
                this.montantAbo = "24.90";
                //Opacity
                this.opac1 = "1";
                this.opac2 = "0";
                this.opac3 = "0";
                this.opac4 = "0";
                //
                this.height1 = "120px";
                setTimeout(() => {
                    this.height2 = "0px";
                    this.height3 = "0px";
                    this.height4 = "0px";
                }, 400);

                setTimeout(() => {
                    this.display2 = "none";
                    this.display3 = "none";
                    this.display4 = "none";
                }, 200);

                setTimeout(() => {
                    this.sectHeight = "120px";
                }, 200);
      
            }else if(num === 2){
                document.getElementById("h1Top").innerText = "Vous avez choisi l'abonnement de 3 mois."
                //Price and type
                this.typeAbo = "3 mois";
                this.montantAbo = "59.70";
                //Opacity
                this.opac1 = "0";
                this.opac2 = "1";
                this.opac3 = "0";
                this.opac4 = "0";
                //
                this.height1 = "0px";
                this.height2 = "120px";
                this.height3 = "0px";
                this.height4 = "0px";
                setTimeout(() => {
                    this.display1 = "none";
                    this.display3 = "none";
                    this.display4 = "none";
                }, 600);

                setTimeout(() => {
                    this.sectHeight = "120px";
                }, 200);
            }else if(num === 3){
                document.getElementById("h1Top").innerText = "Vous avez choisi l'abonnement de 6 mois."
                //Price and type
                this.typeAbo = "6 mois";
                this.montantAbo = "89.40";
                //Opacity
                this.opac1 = "0";
                this.opac2 = "0";
                this.opac3 = "1";
                this.opac4 = "0";
                //
                this.height1 = "0px";
                this.height2 = "0px";
                this.height3 = "120px";
                this.height4 = "0px";
                setTimeout(() => {
                    this.display2 = "none";
                    this.display1 = "none";
                    this.display4 = "none";
                }, 600);

                setTimeout(() => {
                    this.sectHeight = "120px";
                }, 200);
            }else{
                document.getElementById("h1Top").innerText = "Vous avez choisi l'abonnement de 12 mois."
                //Price and type
                this.typeAbo = "12 mois";
                this.montantAbo = "118.80";
                //Opacity
                this.opac1 = "0";
                this.opac2 = "0";
                this.opac3 = "0";
                this.opac4 = "1";
                //
                this.height1 = "0px";
                this.height2 = "0px";
                this.height3 = "0px";
                this.height4 = "120px";
                setTimeout(() => {
                    this.display1 = "none";
                    this.display3 = "none";
                    this.display2 = "none";
                }, 600);

                setTimeout(() => {
                    this.sectHeight = "120px";
                }, 200);
            }

            //Unclick
            this.abonneCardClicked = true;
        }else{
            document.getElementById("h1Top").innerText = "Veuillez choisir le type d'abonnement."
            //
            this.mdPaimentPop = "none";
            this.mdPaimentTitlePop = "none";
            this.formTitlePop = "none";
            this.formPop = "none";
            //
            this.typeAbo = null;
            this.montantAbo = null;
            //
            this.sectHeight = "calc(100% - 85px)";

            this.display1 = "flex";
                this.display2 = "flex";
                this.display3 = "flex";
                this.display4 = "flex";

            setTimeout(() => {
                this.height1 = "calc((100% - 32px) / 4)";
                this.height2 = "calc((100% - 32px) / 4)";
                this.height3 = "calc((100% - 32px) / 4)";
                this.height4 = "calc((100% - 32px) / 4)";
            }, 200);

            
            if(num === 1){
                setTimeout(() => { this.opac1 = "1" }, 200);
                setTimeout(() => { this.opac2 = "1" }, 400);
                setTimeout(() => { this.opac3 = "1" }, 600);
                setTimeout(() => { this.opac4 = "1" }, 800);
            }else if(num === 2){
                setTimeout(() => { this.opac2 = "1" }, 400);
                setTimeout(() => { this.opac1 = "1" }, 600);
                setTimeout(() => { this.opac3 = "1" }, 800);
                setTimeout(() => { this.opac4 = "1" }, 1000);
            }else if(num === 3){
                setTimeout(() => { this.opac3 = "1" }, 400);
                setTimeout(() => { this.opac1 = "1" }, 600);
                setTimeout(() => { this.opac2 = "1" }, 800);
                setTimeout(() => { this.opac4 = "1" }, 1000);
            }else{
                setTimeout(() => { this.opac4 = "1" }, 400);
                setTimeout(() => { this.opac1 = "1" }, 600);
                setTimeout(() => { this.opac2 = "1" }, 800);
                setTimeout(() => { this.opac3 = "1" }, 1000);
            }
            //Click
            this.abonneCardClicked = false;
        }
    }

    paymentWithCard(){
        this.mdPaimentPop = "none";
        this.formTitlePop = "flex";
        this.formPop = "block";
    }

    whichCard(e){
        let cardNumber = e.detail.value;

        if(cardNumber.substring(0, 1) === "4"){
            this.cc = "none";
            this.visa = "block";
            this.diner = "none";
            this.amex = "none";
            this.mcard = "none";
            this.jcb = "none";
        }else if(cardNumber.substring(0, 2) === "30"  || cardNumber.substring(0, 2) === "36" || cardNumber.substring(0, 2) === "38"|| cardNumber.substring(0, 2) === "39"){
            this.cc = "none";
            this.visa = "none";
            this.amex = "none";
            this.diner = "block";
            this.mcard = "none";
            this.jcb = "none";
        }else if(cardNumber.substring(0, 2) === "34" || cardNumber.substring(0, 2) === "37"){
            this.cc = "none";
            this.visa = "none";
            this.amex = "block";
            this.diner = "none";
            this.mcard = "none";
            this.jcb = "none";
        }else if(cardNumber.substring(0, 2) === "35"){
            this.cc = "none";
            this.visa = "none";
            this.amex = "none";
            this.diner = "none";
            this.mcard = "none";
            this.jcb = "block";
        }else if(cardNumber.substring(0, 2) === "51" || cardNumber.substring(0, 2) === "52" || cardNumber.substring(0, 2) === "53" || cardNumber.substring(0, 2) === "54" || cardNumber.substring(0, 2) === "55"){
            this.cc = "none";
            this.visa = "none";
            this.amex = "none";
            this.diner = "none";
            this.mcard = "block";
            this.jcb = "none";
        }
        else if(cardNumber.substring(0, 2) === "22" || cardNumber.substring(0, 2) === "23" || cardNumber.substring(0, 2) === "24" || cardNumber.substring(0, 2) === "25" || cardNumber.substring(0, 2) === "26" || cardNumber.substring(0, 2) === "27"){
            this.cc = "none";
            this.visa = "none";
            this.amex = "none";
            this.diner = "none";
            this.mcard = "block";
            this.jcb = "none";
        }else if(cardNumber === ""){
            this.cc = "block";
            this.visa = "none";
            this.diner = "none";
            this.amex = "none";
            this.mcard = "none";
            this.jcb = "none";
        }else{
            this.cc = "block";
            this.visa = "none";
            this.diner = "none";
            this.amex = "none";
            this.mcard = "none";
            this.jcb = "none";
        }

        //Credit Card Format
        var noSpace = e.detail.value.split(" ").join("");
        var ccFormat;
        if (noSpace > 0) {
            ccFormat = noSpace.match(new RegExp('.{1,4}', 'g')).join(" ");
        }

        this.paiementForm.get('cardNumber').setValue(ccFormat);
    }

}