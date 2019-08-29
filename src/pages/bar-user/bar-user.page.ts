import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ToastController, AlertController } from "@ionic/angular";
import { Storage } from '@ionic/storage';
import { ModalQrcodePage } from '../modal-qrcode/modal-qrcode.page';
import { ModalRatingsPage } from '../modal-ratings/modal-ratings.page';
import { timer } from 'rxjs';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import * as Global from '../../app/global';
declare var google;


@Component({
  selector: 'app-bar-user',
  templateUrl: './bar-user.page.html',
  styleUrls: ['./bar-user.page.scss'],
})
export class BarUserPage implements OnInit {
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  // drinksPhotoURI = 'https://www.macfi.ch/serveur/drinksphotos/';

  myBar : any = {};
  vipUser : any = {};
  mySchedule : Array<any> = [];
  myOffers : Array<any> = [];
  oneOffer : any = {};
  scannedOfferId : any = [];
  scannedUserId : any = [];
  scannedOffers : Array<any> = [];
  getRating : Array<any> = [];
  AllRatings : Array<any> = [];
  ifUserIdScanned = null;
  ifUserIdNotScanned = null;
  ifOfferIdScanned = null;
  ifOfferIdNotScanned = null;
  barName : string;  
  imgLink1 : string;
  imgLink2 : string;
  imgLink3 : string;
  payed : string;
  dateDebut;
  user_id;
  grade : string = "0";
  gradeTot;
  ifDataScanned : boolean = false;
  showBtns : boolean = false;

  touchstartX = 0;
  touchstartY = 0;
  touchendX = 0;
  touchendY = 0;

  lastScroll : number = 0;
  hideHeader : string = "0";
  scrollOffsetTop : number = 0;
  scrollOffsetTopCounter : number = 400;
  scrollCounter : number = 0;
  lastY : number = 0;
  dyn_img_height : string = "400px";
  dyn_imgSlide_opacity : string = "1";
  

  interval;

  dayOfTheWeek : string;
  timeNow : string;
  FilteredSched : Array<any> = [];
  five : string = "05:00:00";
  noon : string = "12:00:00";
  midnight : string = "00:00:00";
  nightShift : boolean = false;
  dayShift : boolean = false;
  nightShiftIn : boolean = false;
  dayShiftIn : boolean = false;

  paramOfferId : string;
  bar_user_countdown : string;
  offerIsActive : boolean = false;

  //Navigator
  directionApp = null;
  //Google maps;
  mapRef = null;
  barAdresse : string = "";
  barNPA : string = "";
  barLocalite : string = "";
  
  if_user_already_rated : boolean = false;
  //
  ifHasConnection : boolean = true;

  constructor(private launchNav: LaunchNavigator, private modalCtrl : ModalController, private toastCtrl: ToastController, private storage : Storage,private http : HttpClient, private aRoute : ActivatedRoute, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController, public alertController: AlertController) { 
   
  }


  directMe(adresse,npa,localite){

    this.launchNav.isAppAvailable(this.launchNav.APP.GOOGLE_MAPS).then((isAvailable)=>{
       if(isAvailable){
          this.directionApp = this.launchNav.APP.GOOGLE_MAPS;
       }else{
          this.directionApp = this.launchNav.APP.USER_SELECT;
       }
       this.launchNav.navigate(adresse+" "+npa+" "+localite,{
          app: this.directionApp
       });
    });
 
  }

  ngAfterViewInit(){
  }  

  ionViewDidEnter(){
    this.initStyle();
    timer(2000).subscribe(() => (this.showBtns = true));
  }

  ionViewWillEnter(){

    this.getScannedCode();     
    this.storage.get('SessionIdKey').then((val) => {
      this.getPaidUser(val);
      this.getVIPUser(val);
      setTimeout(() => {
        this.user_id = val;
      }, 100);
    }); 
    this.loadBar(this.aRoute.snapshot.paramMap.get('id'));
    this.loadSchedule(this.aRoute.snapshot.paramMap.get('id'));
    this.loadOffers(this.aRoute.snapshot.paramMap.get('id'));
    this.getRatings(this.aRoute.snapshot.paramMap.get('id'));
    this.loadOneOfferById(this.aRoute.snapshot.paramMap.get('idOffer'));
    this.paramOfferId = this.aRoute.snapshot.paramMap.get('idOffer');

    //SlideShow Styles
    this.initStyle();
    //
    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
      //If user has no connection
      this.ifHasConnection = false;
    }
    //
    var jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var date = new Date();
    this.dayOfTheWeek = jours[date.getDay()];
    this.timeNow = ('0' + (date.getHours())).slice(-2)+":"+('0' + date.getMinutes()).slice(-2);
  

    if(this.five < this.timeNow && this.noon > this.timeNow){
      this.dayShift = true;
      console.log("Sched => DayShift")   
    }

    if(this.timeNow > this.noon && this.timeNow < this.midnight){
      this.nightShift = true;
      console.log("Sched => NightShift sunset")   
    }

    if(this.timeNow > this.midnight && this.timeNow < this.five){
      this.nightShift = true;   
      console.log("Sched => NightShift dawn")   
    }
    
  }

  ngOnInit() {}

  //*************************************************************************** */
  

  async loadMap(latitide: number, longitude: number, barname: string) {
    
    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: {lat : latitide, lng : longitude},
      zoom: 15,
      disableDefaultUI: true
    });
    google.maps.event.addListenerOnce(this.mapRef, 'idle', () => {
      this.addMaker(latitide, longitude, barname);
    });
  }

  private addMaker(lat: number, lng: number, barname: string) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      animation: google.maps.Animation.DROP,  
      title: barname
    });
  }

  //*************************************************************************** */

  ionViewDidLeave(){
    clearInterval(this.interval);
    this.initStyle();
    document.getElementById("first_pic").classList.remove("firstimgscale");
    document.getElementById("second_pic").classList.remove("secondimgscale");
    document.getElementById("third_pic").classList.remove("thirdimgscale");
    document.getElementById("load_overL").style.opacity = "1";
    document.getElementById("load_overL").style.display = "block";
  }

  

  ifOfferScanned(offerId){
    if(this.scannedOfferId.indexOf(offerId)>-1){
      this.ifOfferIdScanned = true;
      this.ifOfferIdNotScanned = false;
    }else{
      this.ifOfferIdScanned = false;
      this.ifOfferIdNotScanned = true;
    }
  }

  loadBar(idBarParam : string) : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchBarByIdBar", "idBar" : idBarParam},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        var random = Math.floor(Math.random() * 5000);

        this.myBar = data;
        this.barName = data.ENT_NOM;
        this.imgLink1 = this.uplPhotoURI+this.barName+"_1?ran="+random;
        this.imgLink2 = this.uplPhotoURI+this.barName+"_2?ran="+random;
        this.imgLink3 = this.uplPhotoURI+this.barName+"_3?ran="+random;

        // this.loadMap(parseFloat(data.ENT_LATITUDE), parseFloat(data.ENT_LONGITUDE), data.ENT_NOM);

        //Get address and convert to Latitude and Longitude
        // this.barAdresse = data.ENT_ADRESSE;
        // this.barNPA = data.ENT_NPA;
        // this.barLocalite = data.ENT_LOCALITE;
        //
        this.storage.get('SessionIdKey').then((myId) => {
          this.checkIfUserAlreadyRated(myId,data.ENT_ID);
        }); 

        // this.nativeGeocoder.forwardGeocode(this.barAdresse+" "+this.barNPA+" "+this.barLocalite, { useLocale: false, maxResults: 1 })
        // .then((result) => this.loadMap(parseFloat(result[0].latitude), parseFloat(result[0].longitude)))
        // .catch((error: any) => console.log(error));
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  loadSchedule(idBarParam : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "fetchHoraireByBar", "idBar" : idBarParam},
          url       : any      	= this.baseURI;
  
      this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
      {
        this.mySchedule = data;
        //
        var days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        var date = new Date();
        var today = days[date.getDay()];
        var time_Now = ('0' + (date.getHours())).slice(-2)+":"+('0' + date.getMinutes()).slice(-2);

        console.log("Day of the week => ", today);

        this.FilteredSched = this.mySchedule.filter(function(data){
          return data.HOR_JOURS == today;
        });


        if(this.FilteredSched[0].HOR_HEUREDEBUT_JOUR== "00:00:00" && this.FilteredSched[0].HOR_HEUREFIN_JOUR== "00:00:00"){
          this.dayShiftIn = false;
        }else if(this.FilteredSched[0].HOR_HEUREDEBUT_JOUR < time_Now && this.FilteredSched[0].HOR_HEUREFIN_JOUR > time_Now){
          this.dayShiftIn = true;
        }else{
          this.dayShiftIn = false;
        }

        if(this.FilteredSched[0].HOR_HEUREDEBUT_SOIR== "00:00:00" && this.FilteredSched[0].HOR_HEUREFIN_SOIR== "00:00:00"){
          this.nightShiftIn = false;
        }else if(this.FilteredSched[0].HOR_HEUREDEBUT_SOIR < time_Now && this.FilteredSched[0].HOR_HEUREFIN_SOIR > time_Now){
          this.nightShiftIn = true;
        }else{
          this.nightShiftIn = false;
        }
      },
      (error : any) =>
      {
        console.log(error);
      });
  }

  loadOffers(idBarParam : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "getOfferByIdBar", "idBar" : idBarParam},
          url       : any      	= this.baseURI;
  
      this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
      {
        this.myOffers = data;

      },
      (error : any) =>
      {
        console.log(error);
      });
  }

  loadOneOfferById(idOffer : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options 	: any		= { "key" : "getOneOfferById", "id_offer" : idOffer},
          url       : any      	= this.baseURI;
  
      this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
      {
        this.oneOffer = data;
        var id = null;

        setInterval(()=>{
          // Get todays date and time
          let startDate = new Date(this.oneOffer.OFF_DATEDEBUT).getTime();
          let endDate = new Date(this.oneOffer.OFF_DATEFIN).getTime();
          let now = new Date().getTime();
          id = this.oneOffer.OFF_ID;

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
              this.bar_user_countdown = "Offre terminée";
              this.offerIsActive = false;
            }else{
              this.bar_user_countdown = "expire dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
              this.offerIsActive = true;
            }
          }else{
            // Find the distance between now and the count down date
            let distance = startDate - now;
            // Time calculations for days, hours, minutes and seconds
            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
            let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
              this.bar_user_countdown = "active dans "+ days + "j " + hours + "h "+ minutes + "m " + seconds + "s ";
              this.offerIsActive = false;
          }
        }, 1000);

      },
      (error : any) =>
      {
        console.log(error);
      });
  }

  getPaidUser(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          console.log(data.validity); 
          this.payed = data.validity;
        },  
        (error: any) => {
            console.log(error);
        });
    }

    getVIPUser(id : string) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'getVIPUser', 'idUser': id},
          url: any      	= this.baseURI;
    
      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.vipUser = data;
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
            // console.log("Scanned code",this.scannedOffers);
          },  
          (error: any) => {
              console.log(error);
          });
    }

    checkIfScanned(offer_id, user_id){
      if(this.scannedOffers!==null){
        for(var i=0; i<this.scannedOffers.length; i++){
          if(this.scannedOffers[i].CODE_OFFRE_ID===offer_id && this.scannedOffers[i].CODE_INTERNAUTE_ID===user_id){
            return true;        
          }
        } 
      }else{
        return false;
      }
    }

    getRatings(id_bar) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'getRating', 'idBar' : id_bar},
          url: any      	= this.baseURI;
    
      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        
            if(data.totalGrade!==null){
              this.gradeTot = (Math.round(data.totalGrade * 2) / 2).toFixed(1);
              this.grade = this.gradeTot.replace(/\./g,'-')
            }else{
              this.gradeTot = 0;
            }
            console.log("Average is...",data)
          },  
          (error: any) => {
              console.log(error);
          });
    }

    scrollEvent(event){
      let currentScroll = event.detail.scrollTop;
      this.scrollOffsetTop = event.detail.scrollTop;

        if(currentScroll > 0 && this.lastScroll <= currentScroll){
            this.hideHeader = "-50px";
            this.lastScroll = currentScroll;
            this.scrollCounter--;
        }else{
            this.hideHeader = "0px";
            this.lastScroll = currentScroll;
            this.scrollCounter++;
        }
        
        
        if(this.scrollOffsetTop >=0 && this.scrollOffsetTop <=400){
          this.dyn_img_height = (400 - (this.scrollOffsetTop/2))+"px";
        }

        let opac = 400 - (this.scrollOffsetTop/400);
        this.dyn_imgSlide_opacity = (opac-399)+"";
    }

    touchmove(event){}
  
    touchend(){}

    // SLIDESHOW ANIMATION

    touchstart_1(event){
      this.touchstartX = event.touches[0].screenX;
      this.touchstartY = event.touches[0].screenY;
    }

    touchend_1(event){
      this.touchendX = event.changedTouches[0].screenX;
      this.touchendY = event.changedTouches[0].screenY;
      this.handleGesture_1();
    }

    handleGesture_1() {
      if (this.touchendX < this.touchstartX) {
        if(document.getElementById("img_1").style.zIndex === "2"){
          //Z-index
          document.getElementById("img_1").style.zIndex = "1";
          document.getElementById("img_2").style.zIndex = "2";
          //Opacity
          document.getElementById("img_1").style.opacity = "0";
          document.getElementById("img_2").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("first_pic").classList.remove("firstimgscale");}, 800);
          document.getElementById("second_pic").classList.add("secondimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
      if (this.touchendX > this.touchstartX) {
        if(document.getElementById("img_1").style.zIndex === "2"){
          document.getElementById("img_1").style.zIndex = "1";
          document.getElementById("img_3").style.zIndex = "2";
          //Opacity
          document.getElementById("img_1").style.opacity = "0";
          document.getElementById("img_3").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("first_pic").classList.remove("firstimgscale");}, 800);
          document.getElementById("third_pic").classList.add("thirdimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
    }

    touchstart_2(event){
      this.touchstartX = event.touches[0].screenX;
      this.touchstartY = event.touches[0].screenY;
    }

    touchend_2(event){
      this.touchendX = event.changedTouches[0].screenX;
      this.touchendY = event.changedTouches[0].screenY;
      this.handleGesture_2();
    }

    handleGesture_2() {
      if (this.touchendX < this.touchstartX) {
        if(document.getElementById("img_2").style.zIndex === "2"){
          document.getElementById("img_2").style.zIndex = "1";
          document.getElementById("img_3").style.zIndex = "2";
          //Opacity
          document.getElementById("img_2").style.opacity = "0";
          document.getElementById("img_3").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("second_pic").classList.remove("secondimgscale");}, 800);
          document.getElementById("third_pic").classList.add("thirdimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
      if (this.touchendX > this.touchstartX) {
        if(document.getElementById("img_2").style.zIndex === "2"){
          document.getElementById("img_2").style.zIndex = "1";
          document.getElementById("img_1").style.zIndex = "2";
          //Opacity
          document.getElementById("img_2").style.opacity = "0";
          document.getElementById("img_1").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("second_pic").classList.remove("secondimgscale");}, 800);
          document.getElementById("first_pic").classList.add("firstimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
    }

    touchstart_3(event){
      this.touchstartX = event.touches[0].screenX;
      this.touchstartY = event.touches[0].screenY;
    }

    touchend_3(event){
      this.touchendX = event.changedTouches[0].screenX;
      this.touchendY = event.changedTouches[0].screenY;
      this.handleGesture_3();
    }

    handleGesture_3() {
      if (this.touchendX < this.touchstartX) {
        if(document.getElementById("img_3").style.zIndex === "2"){
          document.getElementById("img_3").style.zIndex = "1";
          document.getElementById("img_1").style.zIndex = "2";
          //Opacity
          document.getElementById("img_3").style.opacity = "0";
          document.getElementById("img_1").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("third_pic").classList.remove("thirdimgscale");}, 800);
          document.getElementById("first_pic").classList.add("firstimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
      if (this.touchendX > this.touchstartX) {
        if(document.getElementById("img_3").style.zIndex === "2"){
          document.getElementById("img_3").style.zIndex = "1";
          document.getElementById("img_2").style.zIndex = "2";
          //Opacity
          document.getElementById("img_3").style.opacity = "0";
          document.getElementById("img_2").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("third_pic").classList.remove("thirdimgscale");}, 800);
          document.getElementById("second_pic").classList.add("secondimgscale");
        }
        clearInterval(this.interval);
        this.interval = setInterval(() => {this.slideShow()}, 5000);
      }
    }

    slideShow(){
        if(document.getElementById("img_1").style.zIndex === "2"){
          document.getElementById("img_1").style.zIndex = "1";
          document.getElementById("img_2").style.zIndex = "2";
          //Opacity
          document.getElementById("img_1").style.opacity = "0";
          document.getElementById("img_2").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("first_pic").classList.remove("firstimgscale")}, 800);
          document.getElementById("second_pic").classList.add("secondimgscale");
        }else if(document.getElementById("img_2").style.zIndex === "2"){
          document.getElementById("img_2").style.zIndex = "1";
          document.getElementById("img_1").style.zIndex = "1";
          document.getElementById("img_3").style.zIndex = "2";
          //Opacity
          document.getElementById("img_2").style.opacity = "0";
          document.getElementById("img_3").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("second_pic").classList.remove("secondimgscale");}, 800);
          document.getElementById("third_pic").classList.add("thirdimgscale");
        }else if(document.getElementById("img_3").style.zIndex === "2"){
          document.getElementById("img_3").style.zIndex = "1";
          document.getElementById("img_1").style.zIndex = "2";
          //Opacity
          document.getElementById("img_3").style.opacity = "0";
          document.getElementById("img_1").style.opacity = "1";
          //
          setTimeout(() => {document.getElementById("third_pic").classList.remove("thirdimgscale");}, 800);
          document.getElementById("first_pic").classList.add("firstimgscale");
        }else{
          console.log(document.getElementById("img_1").style.zIndex);
        }
    }
 
    //modal
    async activerOffre(desc, start, end, off_id, ent_id, user_id) {
        const modal = await this.modalCtrl.create({
            component: ModalQrcodePage,
            componentProps: {
              description : desc,
              debut : start,
              fin : end,
              idOff : off_id,
              idEnt : ent_id,
              idUser : user_id
            },
        });
        modal.onDidDismiss().then(() => {
          
        });
        modal.present();
    }

    //modal
    async rate(ent_id, user_id) {
      const modal = await this.modalCtrl.create({
          component: ModalRatingsPage,
          cssClass: "ratings-modal",
          componentProps: {
            idEnt : ent_id,
            idUser : user_id
          },
      });
      modal.onDidDismiss().then(() => {
        this.ionViewWillEnter();
      });
      if(this.if_user_already_rated){
        this.sendNotification("Vous avez déjà donné votre avis sur ce bar.");
      }else{
        modal.present();
      }
  }

    jemabonne(){
      alert("Abonnez-vous dès maintenant pour profiter l'offre !")
    }

    imgLoaded(){
      this.initStyle();
      document.getElementById("load_overL").style.opacity = "0";
      document.getElementById("first_pic").classList.add("firstimgscale");
      setTimeout(() => {
        document.getElementById("load_overL").style.display = "none";  
      }, 800);

      this.interval = setInterval(() => { this.slideShow() }, 5000);    
    }


  retour(){
    clearInterval(this.interval);
    this.initStyle();
    document.getElementById("first_pic").classList.remove("firstimgscale");
    document.getElementById("second_pic").classList.remove("secondimgscale");
    document.getElementById("third_pic").classList.remove("thirdimgscale");

    this.nativePageTransitions.fade(null); 
    this.navCtrl.back();
  }

  retour_offline(){
    this.nativePageTransitions.fade(null); 
    this.navCtrl.back();
  }

  notActiveBtn(){
    this.sendNotification("Cette offre n'est pas encore active");
  }

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
}

  initStyle(){
    document.getElementById("img_1").style.zIndex = "2";
    document.getElementById("img_2").style.zIndex = "1";
    document.getElementById("img_3").style.zIndex = "1";
    document.getElementById("img_1").style.opacity = "1";
    document.getElementById("img_2").style.opacity = "0";
    document.getElementById("img_3").style.opacity = "0";
  }

  // getDirection(){
  //   this.launchNavigator.navigate("Chemin des Coquelicots 9, 1214 Vernier");
  // }

  async rateNotSubscriber(){
    const alert = await this.alertController.create({
      header: "Oops !",
      message: "<h3>Abonnez-vous dès maintenant pour pouvoir donner votre avis/note sur le bar !</h3>",
      buttons: [{
              text: 'OK',
              handler: () => {
              }
          }
      ]
  });

  await alert.present();
  }

  async jemabonneAlert() {
    const alert = await this.alertController.create({
      header: "Oops !",
      message: "<h3>Abonnez-vous dès maintenant pour profiter l'offre !</h3>",
      buttons: [{
              text: 'OK',
              handler: () => {
              }
          }
      ]
  });

  await alert.present();
}

checkIfUserAlreadyRated(my_id : number, bar_id : number) {
  const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any		= { 'key' : 'checkIfUserAlreadyRated', 'iduser': my_id, 'idbar' : bar_id},
      url: any      	= this.baseURI;

  this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
      if(data.num > 0){
          this.if_user_already_rated = true;
          console.log("Already Rated !")
      }else{
          this.if_user_already_rated = false;
          console.log("Not yet Rated !")
      }
  },  
  (error: any) => {
      console.log(error);
  });
}
 

}
// if (this.touchendY < this.touchstartY) {
//     alert(swiped + 'down!');
// }
// if (this.touchendY > this.touchstartY) {
//     alert(swiped + 'up!');
// }
// if (this.touchendY == this.touchstartY) {
//     alert('tap!');
// }