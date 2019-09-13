import { Router, PreloadingStrategy } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { NavController, ModalController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingpagePage } from '../loadingpage/loadingpage.page';
import * as Global from '../../app/global';
import { AborenewService } from '../../app/service/aborenew.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit, AfterViewInit{
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
  @ViewChild(IonContent) maincontent: IonContent;
  scrollOffsetTop : number = 0;
  touchStart : number = 0;
  refresherPosY : number = 0;
  currPosY : number = 0;
  ifPulled : boolean = false;
  posY : string = "translateY(0px)";
  animDur : string = "0s";
  rotate : string = "none";
  popFD : string = "none";
  mainOpac : string = "1";


  constructor(private events : Events, private aborenew : AborenewService, private modalCtrl : ModalController, private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { 
    this.storage.get('SessionIdKey').then((valId) => {
      this.aborenew.triggerRenewal(valId,"CheckIT");
    });

  }

  ngAfterViewInit(){}
  ngOnInit() {}

  ionViewWillEnter(){
    this.storage.get('SessionIdKey').then((valId) => {
      this.aborenew.triggerRenewal(valId,null);
    });
    //
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

  scrollEvent(event){
    this.scrollOffsetTop = event.detail.scrollTop;
    if(this.scrollOffsetTop > 0){
      this.maincontent.scrollY = true;
    }
  }

  pullstart(e){
    this.touchStart = e.changedTouches[0].clientY;
  }

  pull(e){
    this.animDur = "0s";
    var touchEnd = e.changedTouches[0].clientY;
  
    if (this.touchStart > touchEnd) {
      this.refresherPosY--;
    } else {
      this.refresherPosY++;
    }

    //---------------------------------------------
    var incPosY = this.refresherPosY*12;

    if (this.touchStart > touchEnd) {

    }else {
      if(this.scrollOffsetTop ==0){
          this.maincontent.scrollY = false;
          this.ifPulled = true;
          if(incPosY>= 0 && incPosY <= 200){
            this.currPosY = incPosY;
            this.posY = "translateY("+incPosY+"px)";
          }
          if(incPosY > 150 && incPosY < 200){
            this.maincontent.scrollY = false;
          }else{
            this.maincontent.scrollY = true;
          }
      }
    }
  }

  endpull(){
    this.maincontent.scrollY = true;
    if(this.currPosY < 150){
      this.refresherPosY = 0;
      this.posY = "translateY("+this.refresherPosY+"px)";
      this.animDur = "200ms";
    }else{
      //
      if(this.scrollOffsetTop == 0 && this.ifPulled){
        this.ifPulled = false; 
        this.posY = "translateY("+150+"px)";
        this.animDur = "200ms";
        this.rotate = "rotate 600ms infinite linear";
        this.maincontent.scrollY = false;
        this.popFD = "block";
        setTimeout(() => {
          this.animDur = "500ms";
          this.rotate = "none";
          this.refresherPosY = 0;
          this.posY = "translateY("+this.refresherPosY+"px)";
        }, 2200);
  
        setTimeout(() => {
          this.popFD = "none";
          this.mainOpac = "0";
          //Put LifeCycle Hooks Here...
          this.ionViewWillEnter();
          //
        }, 2300);
        
        setTimeout(() => {
          this.mainOpac  = "1";
          this.maincontent.scrollY = true;
        }, 3000);
      }
      //
    }
    
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
