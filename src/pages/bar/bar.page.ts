import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { ModalController, ToastController, IonItemSliding, NavController, IonTextarea, IonContent, AlertController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { ModalSchedulePage } from '../modal-schedule/modal-schedule.page';
import { ModalChangePhotosPage } from '../modal-change-photos/modal-change-photos.page';
import { LoadingpagePage } from '../loadingpage/loadingpage.page';
import { ActivatedRoute } from '@angular/router';
import * as Global from '../../app/global';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.page.html',
  styleUrls: ['./bar.page.scss'],
})
export class BarPage implements OnInit {
  sendnotifURL = 'https://www.drinksup.ch/serveur/mailer/sendnotif.php';
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  @ViewChild(IonTextarea) myInput: IonTextarea;
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  myBar : any = {};
  mySchedule : Array<any> = [];
  barName : string;
  photoNUM : string;
  images : any = {};
  imgLink1 : string;
  imgLink2 : string;
  imgLink3 : string;
  ID_ENT : string;
  barStatus : string;
  dayOfTheWeek : string;
  lirePlusClicked : boolean = false;

  //style
  barInputDisabled : boolean = true;
  activeColor : string = "#070708";
  dNone : string = "none";
  dHide : string = "inline-flex";
  activeBorder : string = "none";
  activeHeight : string = "auto";
  activeHeightTA : string = "130px";
  activeFS : string = ".9rem"
  invalidColor : string = "#DC143C";
  preCovOpac : string = "1";
  preCovDis : string = "block";
  typeBar : string = "block";
  typeBarSelect : string = "none";
  //form
  editBarForm : FormGroup;
  barFromAdminSide;
  allCategories = [];

  roleLogged : string = "";

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

  maxReached : boolean = false;
  filteredBarDesc : string = null;
  givenLimit : number = 255;

  nameNotYetUpdated : boolean = false;
  

  constructor(private alertCtrl : AlertController,private nativePageTransitions: NativePageTransitions, private navCtrl : NavController, private aRoute : ActivatedRoute, private modalCtrl : ModalController, private formBuilder : FormBuilder, private http : HttpClient, private storage : Storage, private camera : Camera, private toastCtrl : ToastController) { 
    this.editBarForm = new FormGroup({
      nomEnt: new FormControl(),
      typeEnt: new FormControl(),
      adresseEnt : new FormControl(),
      NPAEnt: new FormControl(),
      localiteEnt: new FormControl(),
      descEnt : new FormControl()
    });
    this.validationForm();
  }

  validationForm() {
    this.editBarForm = this.formBuilder.group({
        'nomEnt': ['', Validators.required],
        'typeEnt' : ['', Validators.required],
        'descEnt': ['', Validators.required],
        'adresseEnt' : ['', Validators.required],
        'localiteEnt': ['', Validators.required],
        'NPAEnt' : ['', Validators.required]
    });
  }

imgLoad(){
    this.preCovOpac = "0";
    setTimeout(() => {
      this.preCovDis = "none";
    }, 500);
  }

  ngOnInit() {
  }

  ionViewWillEnter(){ 
    this.barFromAdminSide = this.aRoute.snapshot.paramMap.get('id_partenaire');

    this.storage.get('SessionRoleKey').then((role) => {
      this.roleLogged = role;
    });
  
    if(this.barFromAdminSide === null || this.barFromAdminSide === undefined || this.barFromAdminSide === ""){
      this.storage.get('SessionIdKey').then((val) => {
          this.loadBar(val);
      }); 
    }else{
      this.loadBar(this.barFromAdminSide);
    }

    this.getCategorie();
    var jours = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    var date = new Date();
    this.dayOfTheWeek = jours[date.getDay()];

    //[ngStyle]="{'display': dNone}"k if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
        //If user has no connection
        this.ifHasConnection = false;
    }
  }

  getCategorie() : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "get_all_categories"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.allCategories = data;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  loadBar(idUserParam : string) : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchBarByUser", "idUser" : idUserParam},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        var random = Math.floor(Math.random() * 10000);
        this.myBar = data;
        this.barName = data.ENT_NOM;
        this.imgLink1 = this.uplPhotoURI+this.barName+"_1?ran="+random;
        this.imgLink2 = this.uplPhotoURI+this.barName+"_2?ran="+random;
        this.imgLink3 = this.uplPhotoURI+this.barName+"_3?ran="+random;

        if(data.ENT_VALIDATION == "Oui"){
          this.barStatus = "Actif";
          this.invalidColor = "#5dd15d";
        }else{
          this.barStatus = "Inactif";
          this.invalidColor = "#DC143C";
        }

        //Check bar name if it has already been updated
        if(this.barName.substring(0, 6) === "Nom de"){
          this.nameNotYetUpdated = true;
        }else{
          this.nameNotYetUpdated = false;
        }

        // console.log("???",this.nameNotYetUpdated)

        //
        let initTextLength = data.ENT_DESCRIPTION;
        this.givenLimit = 255 - initTextLength.length;
        
        //form
        this.editBarForm.get('nomEnt').setValue(data.ENT_NOM);
        this.editBarForm.get('typeEnt').setValue(data.ENT_SECTEURACTIVITES);
        this.editBarForm.get('adresseEnt').setValue(data.ENT_ADRESSE);
        this.editBarForm.get('NPAEnt').setValue(data.ENT_NPA);
        this.editBarForm.get('localiteEnt').setValue(data.ENT_LOCALITE);
        this.editBarForm.get('descEnt').setValue(data.ENT_DESCRIPTION);
        this.ID_ENT = data.ENT_ID;
        this.loadSchedule(this.ID_ENT);
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  //update bar
  editBar() {
    const nomEnt: string = this.editBarForm.controls['nomEnt'].value;
    const secteurEnt: string = this.editBarForm.controls['typeEnt'].value;
    const descEnt: string = this.editBarForm.controls['descEnt'].value;
    const adresseEnt: string = this.editBarForm.controls['adresseEnt'].value;
    const npaEnt: number = this.editBarForm.controls['NPAEnt'].value;
    const localiteEnt: string = this.editBarForm.controls['localiteEnt'].value;
    const IdEnt : string = this.ID_ENT;
    // Validation Bar to display for Users interface
    const remBreakLine = descEnt.replace(/(\r\n|\n|\r)/gm," ");
    //Pure text
    // var dsds = _.unescape(remBreakLine);
    this.updateImageName(this.barName, nomEnt);
    setTimeout(()=>{
      this.updateBar(nomEnt, descEnt, adresseEnt, localiteEnt, npaEnt, secteurEnt, IdEnt);
      this.sendNotifToAdmin("Mise à jour de description du bar", nomEnt+" (ce bar est maintenant inactif)");
    },1000);
    
}

updateBar(nomEnt: string, descEnt: string, adresseEnt: string, localiteEnt: string, npaEnt: number, secteurEnt: string, idEnt : string) {
  const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
      options: any		= { 'key' : 'simpleUpdateBar', 'nomEnt': nomEnt, 'descEnt': descEnt, 'adresseEnt': adresseEnt, 'localiteEnt': localiteEnt, 'npaEnt': npaEnt, 'secteurEnt': secteurEnt, 'idEnt': idEnt},
      url: any      	= this.baseURI;

  this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.sendNotification('Vos modifications ont bien été pris en compte !');
          this.ionViewWillEnter();
          this.disableEdit();
      },
      (error: any) => {
          console.log(error);
          this.sendNotification('Erreur!');
      });
}

updateImageName(oldNameParam : string, newNameParam : string){
  const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'updateImageName', 'oldName' : oldNameParam, 'newName' : newNameParam},
        url: any      	= this.baseURI;
  this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        console.log(data);
      },
      (error: any) => {
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
    },
    (error : any) =>
    {
      console.log(error);
    });
}

lirePlus(){
  if(this.lirePlusClicked === false){
    document.getElementById("lireplustext").innerHTML = "(Lire moins&nbsp;<ion-icon name='arrow-dropup'></ion-icon>)";
    document.getElementById("noteSect").style.height = "125px";
    this.lirePlusClicked = true;
  }else{
    document.getElementById("lireplustext").innerHTML = "(Lire plus&nbsp;<ion-icon name='arrow-dropdown'></ion-icon>)";
    document.getElementById("noteSect").style.height = "0px";
    this.lirePlusClicked = false;
  }
}

//modal

async editSchedule(jourIdParam : string, jourParam : string, hdj : string, hfj : string, hds : string, hfs : string) {
  this.slidingItem.close();
  const modal = await this.modalCtrl.create( {
      component: ModalSchedulePage,
      cssClass: "edit-schedule-modal",
      showBackdrop : true,
      componentProps: {
        jourId : jourIdParam,
        jour : jourParam,
        horDebJ : hdj,
        horFinJ : hfj,
        horDebS : hds,
        horFinS : hfs
      },
  });
  modal.onDidDismiss().then(() => {
      this.loadSchedule(this.ID_ENT);
  })
  modal.present();
}

async editPhotos(imgNum) {
  const modal = await this.modalCtrl.create( {
      component: ModalChangePhotosPage,
      cssClass: "edit-profilepic-modal",
      showBackdrop : true,
      componentProps: {
        bar_name : this.barName,
        img_num : imgNum
      },
  });
  modal.onDidDismiss().then((data) => {
    if(data.data === undefined){
      console.log("Just an ordinary cancellation");
    }else if(data.data.uploaded == "Yes"){
      this.loadingModal();//open loading modal
    }else{
      console.log("Just an ordinary cancellation");
    }
  })
  modal.present();
}

//

  allowEdit(){
    this.alertUpdateBar();
    this.barInputDisabled = false;
    this.activeColor = "#1b1e27";
    this.dNone = "inline-flex";
    this.dHide = "none";
    this.activeBorder = "1px solid rgba(255,255,255,.7)"
    this.activeHeight = "40px";
    this.activeHeightTA = "150px";
    this.activeFS = "1rem";
    this.typeBar = "none";
    this.typeBarSelect = "flex";

    // let initTextLength = this.editBarForm.controls['descEnt'].value;
    // this.givenLimit = this.givenLimit - initTextLength.length;

  }

  disableEdit(){
    this.barInputDisabled = true;
    this.activeColor = "#070708";
    this.dNone = "none";
    this.dHide = "inline-flex";
    this.activeBorder = "none"
    this.activeHeight = "auto";
    this.activeHeightTA = "130px";
    this.activeFS = ".9rem";
    this.typeBar = "block";
    this.typeBarSelect = "none";
    //
    this.ionViewWillEnter()
  }

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
}

async loadingModal() {
  const modal = await this.modalCtrl.create( {
      component: LoadingpagePage,
      cssClass: "loading-modal",
      showBackdrop : true,
      componentProps: {},
  });
  modal.present();
  setTimeout(() => {
    modal.dismiss();
  }, 8000);
  modal.onDidDismiss().then(() => {
      this.ionViewWillEnter();
  });
}

retour_offline(){
  this.nativePageTransitions.fade(null);  
  this.navCtrl.back();
}

retour(){
  this.nativePageTransitions.fade(null);  
  this.navCtrl.back();
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
    if(this.scrollOffsetTop == 0){
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

checkLength(e){
  let text = this.editBarForm.controls['descEnt'].value
  let textValueOnChange = text.length;
  this.givenLimit = 255 - textValueOnChange;
}

sendNotifToAdmin(title, barname) {
  const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'title' : title, 'barname' : barname, 'nametype' : 'Nom du bar'},
        url: any      	= this.sendnotifURL;

  this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
      {
          console.log(data);
          if(data == "Sent"){
            this.sendNotification("Une notification a été envoyé à l'administrateur");
          }else{
            console.log("Erreur d'envoi de notification");
          }
      },
      (error: any) => {
          console.log(error);
      });
}

async alertUpdateBar(){
  const alert = await this.alertCtrl.create({
      header: "Attention !",
      message: "<h3>Vous allez devoir remettre vos images de bar si vous décidez de modifier le NOM de votre bar.</h3>",
      cssClass : "dimBackdropAlert",
      buttons: [
          {
              text: 'OK',
              role: 'cancel',
              cssClass: 'secondary',
          }
      ]
  });

  await alert.present();
}


}
