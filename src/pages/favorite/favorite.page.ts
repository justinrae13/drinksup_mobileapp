import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingpagePage } from '../loadingpage/loadingpage.page';
import * as Global from '../../app/global';



@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit{
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  items : Array<any> = [];
  log : string;
  faveBarNo;
  ifLoadedAlreadyFave : string = "block";
  //
  lastScroll : number = 0;
  contentSlideUp : string = "translateY(50px)";
  //
  ifHasConnection : boolean = true;
  //Custom Refresher Made By Jutin Rae
  scrollOffsetTop : number = 0;
  scrollCounter : number = 0;
  highCounter : number = 227;
  mcr_scale : string = "scale(0)";
  mcr_dashoffset : string = "227";
  mcr_trans: string = "0s";
  mcr_svgDisplay : string = "block";
  mcr_circleDivDisplay : string = "none";
  mcr_bdDisplay : string = "none";
  lastY : number = 0;


  constructor(private modalCtrl : ModalController, private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { 
    
    

  }

  ionViewWillEnter(){
    this.storage.get('SessionEmailKey').then((val) => {
      this.loadFaveBar(val);
    });

    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
      //If user has no connection
      this.ifHasConnection = false;
    }
  }

  ngOnInit() {}

  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;
    this.scrollOffsetTop = event.detail.scrollTop;
    
      if(currentScroll > 0 && this.lastScroll <= currentScroll){
          this.contentSlideUp = "translateY(0px)";
          this.lastScroll = currentScroll;
      }else{
          this.contentSlideUp = "translateY(50px)";
          this.lastScroll = currentScroll;
      }
  }

  touchmove(event){
    if(this.scrollOffsetTop ==0){

      var currentY = event.touches[0].screenY;

      if(currentY > this.lastY){
        this.scrollCounter++;
      }else if(currentY < this.lastY){
        this.scrollCounter--;
      }

      this.lastY = currentY;
      var slowedCounter = this.scrollCounter/45;
      var doffSet = 227;

      if(slowedCounter <= 1 && slowedCounter > 0){
        this.mcr_scale = "scale("+slowedCounter+")";
        doffSet-=(this.scrollCounter*Math.PI);
        this.mcr_dashoffset = doffSet.toString();
      }

      if(slowedCounter == 1){
        this.mcr_trans = ".2s ease 1.5s";
        this.mcr_svgDisplay = "none";
        this.mcr_circleDivDisplay = "block";
        this.mcr_bdDisplay = "block";
        setTimeout(() => {
          this.mcr_trans = "0s ease 0s";
        }, 1800);
        setTimeout(() => {
          this.mcr_svgDisplay = "block";
          this.mcr_circleDivDisplay = "none";
        }, 2100);
        setTimeout(() => {
          this.ionViewWillEnter();
          this.mcr_bdDisplay = "none";        
        }, 2200);
      }

    }
      
  }

  touchend(){
    this.scrollCounter = 0;
    this.mcr_scale = "scale("+this.scrollCounter+")";
  }


  loadFaveBar(email_param : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchFaveBar", "email": email_param},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.items = data;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  deletefavorite(id_param : number, email_param : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "deleteFavorite", "id" : id_param, "email" : email_param},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
      console.log(data);
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  removeToFave(id){
    this.storage.get('SessionEmailKey').then((val) => {
      this.deletefavorite(id, val);
    });
    setTimeout(() => {
      this.ionViewWillEnter();
    }, 200);
  }

  moveToBar(id : string){
    this.nativePageTransitions.fade(null); 
    this.navCtrl.navigateForward('/bar-user/'+id);
  }

  async loadingModal() {
    const modal = await this.modalCtrl.create( {
        component: LoadingpagePage,
        cssClass: "loading-modal",
        showBackdrop : true,
        componentProps: {},
    });
    modal.onDidDismiss().then(() => {
        this.ionViewWillEnter();
    })
    modal.present();
  }

  displayNone(){
    setTimeout(() => {
      this.ifLoadedAlreadyFave = "none"
    }, 1200);
  }

}
