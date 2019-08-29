import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastController, ModalController, NavController, IonContent, IonSelect } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Router } from '@angular/router';
import * as Global from '../../app/global';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSelect) selectRef: IonSelect;
  customActionSheetOptions: any = {
    header: 'Choisissez le jour',
    subHeader: 'Défilez vers le bas pour voir tous les jours de la semaine'
  };
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  items : Array<any> = [];
  Filtereditems : Array<any> = [];
  scannedOffers : Array<any> = [];
  pushedScannedOffers : Array<any> = [];
  user_id;
  random : number;
  randomImgNo : number;
  contentSlideUp : string = "translateY(50px)";
  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  hideHeader : string = "0";
  hideSubHeader : string = "50px";
  lastScroll : number = 0;
  tousClicked : boolean = false;
  encoursClicked : boolean = false;
  imminentClicked : boolean = false;
  intervalInit;
  joursDeLaSemaine = [
    {num : '1', nomFr : 'Lundi'},
    {num : '2', nomFr : 'Mardi'},
    {num : '3', nomFr : 'Mercredi'},
    {num : '4', nomFr : 'Jeudi'},
    {num : '5', nomFr : 'Vendredi'},
    {num : '6', nomFr : 'Samedi'},
    {num : '7', nomFr : 'Dimanche'}
  ];
  noOffer : boolean = false;
  ifLoadedAlready : string = "block";

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
    
  constructor(private router: Router, private navCtrl : NavController, private nativePageTransitions: NativePageTransitions, private modalCtrl : ModalController, private storage : Storage, private http : HttpClient, private toastCtrl : ToastController) { 
    this.random = Math.floor(Math.random() * 100);
    this.randomImgNo = Math.floor(Math.random() * 3)+1;
  }

  ngOnInit() {
  }
  

  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;
    this.scrollOffsetTop = event.detail.scrollTop;
    
      if(currentScroll > 0 && this.lastScroll <= currentScroll){
          this.hideHeader = "-50px";
          this.hideSubHeader = "0px";
          this.contentSlideUp = "translateY(0px)";
          this.lastScroll = currentScroll;
      }else{
          this.hideHeader = "0px";
          this.hideSubHeader = "50px";
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


  ionViewWillEnter(){
    this.storage.get('SessionIdKey').then((val) => {
      this.getPaidUser(val);
      this.loadBar(val);
    }); 


    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
      //If user has no connection
      this.ifHasConnection = false;
    }

    // this.intervalInit = setInterval(() => { 
    //   this.setCountDown(); 
    // }, 1000);   
  }

  ionViewDidLeave(){
    clearInterval(this.intervalInit);
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    this.tous();

    this.selectRef.value = "all";
  }

  getPaidUser(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          console.log(data);
        },  
        (error: any) => {
            console.log(error);
        });
  }

  loadBar(userId) : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "getAllOffers", "user_id" : userId},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        for(var i in data){
            var newdate = new Date(data[i].OFF_DATEDEBUT);
            var newformatDate = new Date(newdate.getTime() - newdate.getTimezoneOffset()*60000);
            data[i].OFF_DATEDEBUT = newformatDate.toISOString();
        }   
        this.items = data;
        this.Filtereditems = this.items;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  setCountDown(){
      let range = this.Filtereditems.length;
      let data = this.Filtereditems;

      for(var i = 0; i<range; i++){
        // Get todays date and time
        let startDate = new Date(data[i].OFF_DATEDEBUT).getTime();
        let endDate = new Date(data[i].OFF_DATEFIN).getTime();
        let now = new Date().getTime();

        // Output the result in an element with id="demo"
        if(now>startDate){
          // Find the distance between now and the count down date
          let distance = endDate - now;
          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(distance<0){
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "Offre terminée";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "rgb(82,82,82)";
          }else{
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "expire dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "rgba(196, 0, 0, .4)";
            document.getElementById("countdown_"+data[i].OFF_ID).style.border = "1px solid rgb(196, 0, 0)";
            document.getElementById("countdown_"+data[i].OFF_ID).style.color = "#fff";
          }
        }else{
          // Find the distance between now and the count down date
          let distance = startDate - now;
          // Time calculations for days, hours, minutes and seconds
          let days = Math.floor(distance / (1000 * 60 * 60 * 24));
          let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          let seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(document.getElementById("countdown_"+data[i].OFF_ID) !== null){
            document.getElementById("countdown_"+data[i].OFF_ID).innerHTML = "active dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
            document.getElementById("countdown_"+data[i].OFF_ID).style.backgroundColor = "transparent";            
          }
        }
      }
  }

  tous(){
    this.Filtereditems = this.items;

    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.encoursClicked = false;
    this.imminentClicked = false;
  }

  encours(){
    this.tabPosition = "translateX(-50%)";
    this.leftPosition = "50%";
    this.activeColor2 = "#fff";
    this.activeColor1 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.Filtereditems = this.items.filter(function(data : any){
      var today = new Date().getTime();
      var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
      return today>dateStart; 
    });

    this.tousClicked = false;
    this.encoursClicked = true;
    this.imminentClicked = false;
  }

  imminent(){
    this.tabPosition = "translateX(-100%)";
    this.leftPosition = "100%";
    this.activeColor3 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor1 = "rgb(82, 82, 82)";

    this.Filtereditems = this.items.filter(function(data : any){
      var today = new Date().getTime();
      var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
      return today<dateStart; 
    });   

    this.tousClicked = false;
    this.encoursClicked = false;
    this.imminentClicked = true;
  }

  openSelect(){
    this.selectRef.open();
  }

  filterByDay(event){

    if(this.Filtereditems === null){
      return false;
    }else{
      if(event.detail.value=="all"){
        this.Filtereditems = this.items;
      }else{
        this.Filtereditems = this.items.filter((offer) => {
          var dateStart = new Date(offer.OFF_DATEDEBUT).getDay();
          return (dateStart == event.detail.value);
        });
      }
    }

    if(this.Filtereditems.length <= 0){
      this.noOffer = true;
    }else{
      this.noOffer = false;
    }
    
    
  }

    
  moveToBar(id : string, id_offer : string){
    this.nativePageTransitions.fade(null); 
    this.navCtrl.navigateForward("/bar-user/"+id+"/"+id_offer);
    
  }

  displayNone(){
    setTimeout(() => {
      this.ifLoadedAlready = "none"
    }, 1200);
  }

}
