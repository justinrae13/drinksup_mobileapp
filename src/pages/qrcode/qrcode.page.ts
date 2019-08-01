import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {

  public qrData : string = "";
  public codeHolder : string = "";
  public codeContenu : string = "";
  ifScanned : boolean = false;
  scannedOffers : Array<any> = [];
  chosenBar = {};
  baseURI = Global.mainURI;
  

  constructor(private barcode : BarcodeScanner, private http : HttpClient, private storage : Storage) { 

  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getScannedCode();
    this.storage.get('SessionIdKey').then((val) => {
      this.getBarByUserId(val);
    }); 

  }

  getBarByUserId(id_bar) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getBarByProprio', 'proprio' : id_bar},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.chosenBar = data.ENT_ID;
        console.log("piwit" , this.chosenBar)
    },  
    (error: any) => {
        console.log(error);
    });
  }

  getScannedCode() {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getScannedCode'},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.scannedOffers = data;
          console.log(this.scannedOffers);
        },  
        (error: any) => {
            console.log(error);
        });
  }

  scannerCodeDelay(){
    setTimeout(() => {
      this.scannerCode();
    }, 500);
  }

  scannerCode(){
    this.barcode.scan().then(data =>{
      this.codeContenu = data.text;
      const individualData = data.text.split("/");
      //Filtered Data
      const desc = individualData[0],
            start = individualData[1],
            end = individualData[2],
            offId = parseInt(individualData[3]),
            barId = parseInt(individualData[4]),
            userId = parseInt(individualData[5]);
      //
      if(this.scannedOffers!==null){
        for(var i=0; i<this.scannedOffers.length; i++){
          if(this.scannedOffers[i].CODE_OFFRE_DESCRIPTION===desc && this.scannedOffers[i].CODE_OFFRE_DATEDEBUT===start && this.scannedOffers[i].CODE_OFFRE_DATEFIN===end && this.scannedOffers[i].CODE_OFFRE_ID===offId && this.scannedOffers[i].CODE_ENTREPRISE_ID===barId && this.scannedOffers[i].CODE_INTERNAUTE_ID===userId){
            this.ifScanned = true;
            break;   
          }else{
            this.ifScanned = false;          
          }
        }
      }else{
        this.ifScanned = false; 
      }

      setTimeout(() => {
        if(!this.ifScanned){
          if(desc == "" || desc === null || desc === undefined){
            alert("Scan annulé")
          }else if(barId !== this.chosenBar){
            alert("L'offre appartient à un autre bar !")
          }else{
            this.addToScannedCode(desc, start, end, offId, barId, userId);
            alert("Offre validé !");
            this.ionViewWillEnter();
          }
        }else{
          alert("L'offre a été déjà utilisée !");
          this.ionViewWillEnter();
        }
      }, 100);
      
    });
  }

  addToScannedCode(desc, start, end, idOff, idBar, idUser) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'addToScannedCode', 'desc': desc, 'start': start, 'end': end, 'idOff': idOff, 'idBar': idBar, 'idUser': idUser},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          console.log(data.message);
        },  
        (error: any) => {
            console.log(error);
        });
  }

}
