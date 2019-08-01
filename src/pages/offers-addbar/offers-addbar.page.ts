import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AlertController, IonItemSliding, ModalController, NavParams, ToastController} from '@ionic/angular';
import * as Global from '../../app/global';


@Component({
  selector: 'app-offers-addbar',
  templateUrl: './offers-addbar.page.html',
  styleUrls: ['./offers-addbar.page.scss'],
})
export class OffersAddbarPage implements OnInit {
    bars = [];
    haveBarOrNot = '';
    jour = '';
    barBoolean: boolean;
    barJour = [];
    barPourJour = [];
    bar2  = [];
    barJour2  = [];
    idJour: number;
    public baseURI = Global.mainURI;
  constructor(public http: HttpClient, private navParams: NavParams, private modalController: ModalController, public alertController: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {
      this.jour = this.navParams.get('jours');
      this.ionViewWillEnter();
     // console.log(this.barJo);
      //
      // this.getBarsForDay();

  }
  public ionViewWillEnter(): void {
      this.bars = [];
      this.getBar(this.jour);
      this.getBarJour(this.jour);

  }

  public getBar(jour: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getAddBarByDay', 'jour': jour},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.bars = data;

        });

    }
    closeModal() {
        this.modalController.dismiss();
        // this.usersPage.ngOnInit();
    }
    async add(slidingItem: IonItemSliding, id) {
      await slidingItem.close();
      this.idJour = this.jour === 'Lundi' ? 1 :
      this.idJour = this.jour === 'Mardi' ? 2 :
      this.idJour = this.jour === 'Mercredi' ? 3 :
      this.idJour = this.jour === 'Jeudi' ? 4 :
      this.idJour = this.jour === 'Vendredi' ? 5 :
      this.idJour = this.jour === 'Samedi' ? 6 : 7;
      console.log('identifiant de entreprise ' + id  + ' pour le jour ' + this.idJour);
      this.alertAddBar(id, this.idJour, this.jour);
      // this.closeModal();
    }
    public getBarJour(jour: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getBarJour', 'jour': jour},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.barJour = data;
            if (this.barJour == null ) {this.haveBarOrNot = 'Aucun Bar ne fait d\'offres le ' + jour; } else {this.haveBarOrNot = ''; }
        });

    }

    async alertAddBar(id, idJour, jour) {
        const alert = await this.alertController.create({
            header: 'Êtes vous sûr d\'ajouter cet entreprise pour l\'offre de ' + jour,
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
                        // this.updateRole(id);
                        // this.createEntreprise(id);
                        this.addOffer(id, idJour);
                        this.ionViewWillEnter();
                        console.log('Confirm Okay');
                    }
                }
            ]
        });

        await alert.present();
    }

    addOffer(id: number, idJour: number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'insertOffers', 'id': id, 'idJour': idJour},
            url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.sendNotification('L\'ajout de l\'offre a bien été pris en compte!');

            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
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
