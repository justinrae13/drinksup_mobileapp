import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as Global from '../../app/global';


@Component({
  selector: 'app-modalbar-admin',
  templateUrl: './modalbar-admin.page.html',
  styleUrls: ['./modalbar-admin.page.scss'],
})
export class ModalbarAdminPage implements OnInit {
  passedIdUser = null;
  passedIdEnt = null;
  bars = [];
  nomEnt = '';
  secteurEnt = '';
  descEnt = '';
  npaEnt = '';
  localiteEnt = '';
  adresseEnt = '';
  idEnt = '';

  public baseURI = Global.mainURI;
  public modifierForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private navParams: NavParams,  public http: HttpClient, private toastCtrl: ToastController, private modalController: ModalController) {
      this.modifierForm = new FormGroup({
         nomEnt: new FormControl(),
         descEnt: new FormControl(),
         adresseEnt: new FormControl(),
         localiteEnt: new FormControl(),
         npaEnt: new FormControl(),
         secteurEnt: new FormControl(),
         idEnt: new FormControl()
      });
      this.validationForm();
  }
    validationForm() {
        this.modifierForm = this.formBuilder.group({
            'nomEnt': ['', Validators.required],
            'secteurEnt' : ['', Validators.required],
            'descEnt': ['', Validators.compose([Validators.maxLength(250), Validators.required])],
            'adresseEnt' : ['', Validators.required],
            'localiteEnt': ['', Validators.required],
            'idEnt': ['', Validators.required],
            'npaEnt' : ['', Validators.compose([Validators.maxLength(4), Validators.minLength(4), Validators.pattern('^[0-9]*$'), Validators.required])],
        });
    }
  ngOnInit() {
      this.passedIdUser = this.navParams.get('idUser');
      this.passedIdEnt = this.navParams.get('idEnt');
      this.bars = [];
      this.getBar(this.passedIdUser, this.passedIdEnt);
  }

    public getBar(idUser: number, idEnt: number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getBar', 'idUser': idUser, 'idEnt': idEnt},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.bars = data;
            this.nomEnt = this.bars[0].ENT_NOM;
            this.secteurEnt = this.bars[0].ENT_SECTEURACTIVITES;
            this.descEnt = this.bars[0].ENT_DESCRIPTION;
            this.adresseEnt = this.bars[0].ENT_ADRESSE;
            this.npaEnt = this.bars[0].ENT_NPA;
            this.localiteEnt = this.bars[0].ENT_LOCALITE;
            this.idEnt = this.bars[0].ENT_ID;
        });

    }
    editBar() {
        const nomEnt: string = this.modifierForm.controls['nomEnt'].value;
        const secteurEnt: string = this.modifierForm.controls['secteurEnt'].value;
        const descEnt: string = this.modifierForm.controls['descEnt'].value;
        const adresseEnt: string = this.modifierForm.controls['adresseEnt'].value;
        const npaEnt: number = this.modifierForm.controls['npaEnt'].value;
        const localiteEnt: string = this.modifierForm.controls['localiteEnt'].value;
        const idEnt: number = this.modifierForm.controls['idEnt'].value;
        console.log(nomEnt + secteurEnt + adresseEnt + localiteEnt + ' idEnt-> ' + idEnt);
        // Validation Bar to display for Users interface
        this.updateBar(nomEnt, descEnt, adresseEnt, localiteEnt, npaEnt, secteurEnt, idEnt);

    }
//  	ENT_ID 	ENT_NOM 	ENT_DESCRIPTION 	ENT_ADRESSE 	ENT_LOCALITE 	ENT_NPA 	ENT_SECTEURACTIVITES 	ENT_VALIDATION
    updateBar(nomEnt: string, descEnt: string, adresseEnt: string, localiteEnt: string, npaEnt: number, secteurEnt: string, idEnt: number) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'updateBar', 'nomEnt': nomEnt, 'descEnt': descEnt, 'adresseEnt': adresseEnt, 'localiteEnt': localiteEnt, 'npaEnt': npaEnt, 'secteurEnt': secteurEnt, 'idEnt': idEnt},
            url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.sendNotification('Votre modification a bien été pris en compte !');
                this.closeModal();
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }
    closeModal() {
        this.modalController.dismiss();
        // this.usersPage.ngOnInit();
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
