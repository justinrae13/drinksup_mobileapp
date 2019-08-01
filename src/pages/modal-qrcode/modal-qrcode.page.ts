import { ModalController, NavParams } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as Global from '../../app/global';


@Component({
  selector: 'app-modal-qrcode',
  templateUrl: './modal-qrcode.page.html',
  styleUrls: ['./modal-qrcode.page.scss'],
})
export class ModalQrcodePage implements OnInit {
  description = null;
  start = null;
  end = null;
  idEnt = null;
  idOff = null;
  idUser = null;
  codeContent = null;
  baseURI = Global.mainURI;
  chosenBar = {};


  constructor(private http : HttpClient, private navParams : NavParams, private modalCtrl : ModalController, private barcode : BarcodeScanner) { }

  ngOnInit() {
    this.description = this.navParams.get("description");
    this.start = this.navParams.get("debut");
    this.end = this.navParams.get("fin");
    this.idOff = this.navParams.get("idOff");
    this.idEnt = this.navParams.get("idEnt");
    this.idUser = this.navParams.get("idUser");
    this.getBarById(this.navParams.get("idEnt"));


    if(this.description !== null){
      this.genererCode();
    }
    
  }

  ionViewWillEnter(){
    
  }

  getBarById(id_bar) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'fetchABarById', 'idBar' : id_bar},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.chosenBar = data;
    },  
    (error: any) => {
        console.log(error);
    });
  }

  annuler(){
    this.modalCtrl.dismiss();
  }

  genererCode(){
    this.codeContent = this.description+"/"+this.start+"/"+this.end+"/"+this.idOff+"/"+this.idEnt+"/"+this.idUser;
  }

  encodedText() {
    this.barcode
      .encode(this.barcode.Encode.TEXT_TYPE, this.barcode)
      .then(
        encodedData => {
          console.log(encodedData);
          this.description = encodedData;
        },
        err => {
          console.log("Error occured : " + err);
        }
      );
  }

}
