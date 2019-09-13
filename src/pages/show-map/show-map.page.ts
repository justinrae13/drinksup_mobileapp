import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { NavController } from '@ionic/angular';
declare var google;


@Component({
  selector: 'app-show-map',
  templateUrl: './show-map.page.html',
  styleUrls: ['./show-map.page.scss'],
})
export class ShowMapPage{
  latitude : number = null;
  longitude : number = null;
  fullAddress : string = null;
  mapRef = null;
  constructor(private actRout : ActivatedRoute, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { }

  ionViewWillEnter():void{
    this.latitude = parseFloat(this.actRout.snapshot.paramMap.get("lat"));
    this.longitude = parseFloat(this.actRout.snapshot.paramMap.get("long"));
    this.fullAddress = this.actRout.snapshot.paramMap.get("address");

    // console.log("Lat =>"+this.latitude+" Long =>"+this.longitude+" Full address =>"+this.fullAddress)
    this.loadMap(this.latitude, this.longitude);
  }

  async loadMap(latitide: number, longitude: number) {
    const mapEle: HTMLElement = document.getElementById("full-map");
    this.mapRef = new google.maps.Map(mapEle, {
      center: {lat : latitide, lng : longitude},
      zoom: 17,
      disableDefaultUI: true
    });
    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      this.addMaker(latitide, longitude);
    });
  }

  private addMaker(lat: number, lng: number) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      animation: google.maps.Animation.DROP,  
    });
  }

  retour(){
    this.nativePageTransitions.fade(null);
    this.navCtrl.back();
  }

}
