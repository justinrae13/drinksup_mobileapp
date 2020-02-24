import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage {
  sendnotifURL = 'https://www.drinksup.ch/serveur/mailer/sendnotif.php';
  public qrData : string = "";
  public codeHolder : string = "";
  public codeContenu : string = "";
  ifScanned : boolean = false;
  scannedOffers : Array<any> = [];
  chosenBar = {};
  baseURI = Global.mainURI;
  userReallySubbed : boolean = true;
  userAlreadyCanRate : boolean = false;
  user_name : string;
  user_email : string;
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
  userRole : string = "notVIP";
  
  constructor(private toastCtrl : ToastController, private alertCtrl : AlertController, private barcode : BarcodeScanner, private http : HttpClient, private storage : Storage) { }

  ionViewWillEnter(){
    this.getScannedCode();
    this.storage.get('SessionIdKey').then((val) => {
      this.getBarByUserId(val);
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

  getBarByUserId(id_bar) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getBarByProprio', 'proprio' : id_bar},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.chosenBar = data.ENT_ID;
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
          // console.log(this.scannedOffers);
        },  
        (error: any) => {
            console.log(error);
        });
  }

  scannerCodeDelay(){
    this.getScannedCode();
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
      this.userCheck(userId);
      this.getUser(userId);
      this.checkIfUserCanRate(userId, barId);

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
          if(desc == "" || desc === null || desc === undefined){
            this.alert("Scan annulé", "alertOrange", "alert");
            this.ionViewWillEnter();
          }else if(barId !== this.chosenBar){
            this.alert("Code invalide !<br><br>Cette offre appartient à un autre bar.", "alertRed", "close-circle");
            this.ionViewWillEnter();
          }else if(!this.userReallySubbed && this.userRole === "notVIP"){
            this.alertWButton("Une anomalie s'est produite !\nL'utilisateur n'est pas abonné ! Prevenir l'administrateur.", this.user_name, this.user_email);
            this.ionViewWillEnter();
          }else if(this.ifScanned){
            this.alert("L'offre a été déjà utilisée !", "alertRed", "alert");
            this.ionViewWillEnter();
          }else{
            this.addToScannedCode(desc, start, end, offId, barId, userId);
            this.alert("L'offre est validée !", "alertGreen", "checkmark-circle");
            this.ionViewWillEnter();
              if(!this.userAlreadyCanRate){
                this.makeUserRate(userId, barId);
              }else{
                  //Change this
                  console.log("User can already give ratings so no need to add")
              }
          }
      }, 500);
      
    });
  }

  async alert(msg, color, icon) {
    const alert = await this.alertCtrl.create({
        header: "Alerte",
        message: "<div> <ion-icon name="+icon+"></ion-icon><h2>"+msg+"</h2></div>",
        cssClass : "dimBackdropAlert "+color,
        buttons: [
            {
                text: 'OK',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                }
            }
        ]
      });

      await alert.present();
  }

  async alertWButton(msg, name, email) {
    const alert = await this.alertCtrl.create({
        header: "Alerte !",
        message: "<h3>"+msg+"</h3>",
        cssClass : "dimBackdropAlert",
        buttons: [
            {
                text: 'Prevenir l\'admin',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  this.sendNotifToAdmin("Une anomalie ! L'utilisateur n'est pas abonné mais a réussi à activer le QRCode", name+" ("+email+")");
                }
            }
        ]
      });

      await alert.present();
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

  userCheck(userId : number){
    console.log("USER ID===>>", userId)
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'checkIfUserReallySubbed', 'id': userId},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          console.log("1 IF SUBBED AND 0 IF NOT SUBBED",data.total);
          if(data.total == 0){
            this.userReallySubbed = false;
            console.log("Not subbed");
          }else{
            this.userReallySubbed = true;
            console.log("Subbed or VIP");
          }
        },  
        (error: any) => {
            console.log(error);
        });
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

  async sendNotification(msg: string) {
      const toast = await this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top'
      });
      toast.present();
  }

  sendNotifToAdmin(title, barname) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'title' : title, 'barname' : barname, 'nametype' : 'Nom de l\'utilisateur'},
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

  getUser(idSession : number){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getUsersById", "idSession" : idSession},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            this.user_name = data.INT_PRENOM;
            this.user_email = data.INT_EMAIL;
            if(data.Roles_ROL_ID === 4 || data.Roles_ROL_ID === "4"){
              this.userRole = "VIP"
            }else{
              this.userRole = "notVIP";
            }
            
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }

  makeUserRate(idUser, IdBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
    options 	: any		= {"key" : "makeUserRate", "idUser" : idUser, 'idBar' : IdBar},
    url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
      //Change this
        this.sendNotification(data)
    },
    (error : any) =>
    {
        console.dir(error);
    });
  }

  checkIfUserCanRate(idUser, IdBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
    options 	: any		= {"key" : "checkIfUserCanRate", "idUser" : idUser, 'idBar' : IdBar},
    url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
      if(data.total == 0){
        this.userAlreadyCanRate = false;
      }else{
        this.userAlreadyCanRate = true;
      }
    },
    (error : any) =>
    {
        console.dir(error);
    });
  }


}
