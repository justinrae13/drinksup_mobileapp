import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ModalController, NavParams, ToastController} from '@ionic/angular';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import * as Global from '../../app/global';

@Component({
  selector: 'app-modal-schedule',
  templateUrl: './modal-schedule.page.html',
  styleUrls: ['./modal-schedule.page.scss'],
})
export class ModalSchedulePage implements OnInit {

  baseURI = Global.mainURI;
  jourId : string;
  jour : string;

  //form
  updateSched : FormGroup;


  constructor(private modalCtrl : ModalController, private navParam : NavParams, private toastCtrl : ToastController, private http : HttpClient) { 
    this.updateSched = new FormGroup({
      heureDebutJour: new FormControl(),
      heureFinJour: new FormControl(),
      heureDebutSoir: new FormControl(),
      heureFinSoir: new FormControl()
    });
  }

  ngOnInit() {
    this.jourId = this.navParam.get('jourId');
    this.jour = this.navParam.get('jour');
    var horDebJ = this.navParam.get('horDebJ');
    var horFinJ = this.navParam.get('horFinJ');
    var horDebS = this.navParam.get('horDebS');
    var horFinS = this.navParam.get('horFinS');


    this.updateSched.get('heureDebutJour').setValue(horDebJ);
    this.updateSched.get('heureFinJour').setValue(horFinJ);
    this.updateSched.get('heureDebutSoir').setValue(horDebS);
    this.updateSched.get('heureFinSoir').setValue(horFinS);
  }

  validButton(){
    document.getElementById("submitBtn").click();
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  editSched() {
    const hDebJ: string = this.updateSched.controls['heureDebutJour'].value;
    const hFinJ: string = this.updateSched.controls['heureFinJour'].value;
    const hDebS: string = this.updateSched.controls['heureDebutSoir'].value;
    const hFinS: string = this.updateSched.controls['heureFinSoir'].value;
    const jId: string = this.jourId;
    // Validation Bar to display for Users interface
    this.updateSchedule(jId, hDebJ, hFinJ, hDebS, hFinS);
  }

  updateSchedule(idParam: string, hDebJParam: string, hFinJParam : string, hDebSParam: string, hFinSParam : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'updateSched', 'jourId': idParam, 'heureDebJour': hDebJParam, 'heureFinJour': hFinJParam, 'heureDebSoir': hDebSParam, 'heureFinSoir': hFinSParam},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.modalCtrl.dismiss(); 
          this.sendNotification('Votre modification a bien été pris en compte !');
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
  }

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: 'bottom'
    });
    toast.present();
}


}
