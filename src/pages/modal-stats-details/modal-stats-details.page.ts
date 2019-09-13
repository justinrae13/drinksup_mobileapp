import { ModalController, NavParams } from '@ionic/angular';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from '@angular/core';
import * as Global from '../../app/global';

@Component({
  selector: 'app-modal-stats-details',
  templateUrl: './modal-stats-details.page.html',
  styleUrls: ['./modal-stats-details.page.scss'],
})
export class ModalStatsDetailsPage{
  scannedCodesDetails : any = [];
  baseURI = Global.mainURI;

  constructor(private modalCtrl : ModalController, private navParam : NavParams, private http: HttpClient) { }

  ionViewWillEnter() {;
    this.getScannedDetails(this.navParam.get('dateParam'), this.navParam.get('idParam'));
  }

  getScannedDetails(dateScanned, userBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getScannedDetails", "proprio" : userBar, "dateScanned" : dateScanned},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            
            if(data === null){
              console.log("No Data");
              // this.noDataForMoreDetails = true;

            }else{
              this.scannedCodesDetails = data;
              // this.noDataForMoreDetails = false;
            }
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }


  closeModal(){
    this.modalCtrl.dismiss();
  }

}
