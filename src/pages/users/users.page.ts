import { Component, OnInit, ViewChild } from '@angular/core';
import {
    AlertController,
    IonItemSliding,
    ModalController,
    NavController,
    ToastController,
    IonContent
} from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalPage} from '../modal/modal.page';
import * as moment from 'moment';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import * as Global from '../../app/global';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  public baseURI = Global.mainURI;
  users = [];
  value = 0;
  haveUserOrNot = '';
  usersFilter = [];
  user = null;
  today;
  clicked : boolean = false;
  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  activeColor4 : string = "rgb(82, 82, 82)";
  lastScroll : number = 0;
  hideHeader : string = "0";
  hideSubHeader: string = "50px";
  tousClicked : boolean = false;
  abonneClicked : boolean = false;
  termineClicked : boolean = false;
  vipClicked : boolean = false;

  //
  contentSlideUp : string = "translateY(100px)";
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

  constructor(private splashScreen: SplashScreen, private emailComposer: EmailComposer, private navCtrl: NavController, private toastCtrl: ToastController, public http: HttpClient, public modalController: ModalController, public alertController: AlertController) { }

  ngOnInit() {}

public ionViewWillEnter(): void {
    this.getUsers();
    this.tous();
    this.today = new Date().toISOString();
    
    //Check if user has internet connection
    if(navigator.onLine){
        //If user has connection
        this.ifHasConnection = true;
    }else{
    //If user has no connection
    this.ifHasConnection = false;
    }
}
  public getUsers() {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'getUsers'},
          url: any      	= this.baseURI;
      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

            for(var i in data){

                var newStart = new Date(data[i].ABO_DATEDEBUT);
                var newEnd = new Date(data[i].ABO_DATEFIN);

                var mnewStart = moment(newStart).format();
                var mnewEnd = moment(newEnd).format();

                if(data[i].ABO_DATEDEBUT !== null && data[i].ABO_DATEFIN !== null){
                    data[i].ABO_DATEDEBUT = mnewStart;
                    data[i].ABO_DATEFIN= mnewEnd;
                }
            }
            this.users = data;
            this.usersFilter = this.users;
            // console.log(this.usersFilter);
            if (this.users == null ) {this.haveUserOrNot = 'Aucun Internaute ayant le role USERS'; } else {this.haveUserOrNot = ''; }
      });

  }

  ionViewDidLeave(){
      this.tous();
      this.hideHeader = "0px";
      this.hideSubHeader = "50px";
      this.contentSlideUp = "translateY(100px)";
  }

  expand(index){
      if(!this.clicked){
        document.getElementById("sub_content_"+index).style.height = "130px";
        document.getElementById("sub_content_"+index).style.marginTop = "15px";

        this.clicked = true;
      }else{
        document.getElementById("sub_content_"+index).style.height = "0px";
        document.getElementById("sub_content_"+index).style.marginTop = "0px";
        this.clicked = false;
      }
  }

  async edit(slidingItem: IonItemSliding, id, prenom, nom, email) {
      await slidingItem.close();
      const modal = await this.modalController.create( {
          component: ModalPage,
          componentProps: {
              id: id,
              prenom: prenom,
              email: email
          },
      });
      modal.onDidDismiss().then(() => {
          this.getUsers();
      })
      modal.present();
      this.ionViewWillEnter();
  }

  async delete(slidingItem: IonItemSliding, id, nom) {
      await slidingItem.close();
      this.presentAlert(id, nom);
  }

  async cantDelete(slidingItem: IonItemSliding, nom) {
    await slidingItem.close();
    this.presentAlertSecond(nom);
 }

  async editRole(slidingItem: IonItemSliding, id, nom) {
      await slidingItem.close();
      this.alertRoles(id, nom);
    }

  async makeVip(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        this.alertBoxMakeVip(id, nom);
   }

   async makeUnVip(slidingItem: IonItemSliding, id, nom) {
        await slidingItem.close();
        this.alertBoxMakeUnVip(id, nom);
 }

   async alertBoxMakeVip(id, nom) {
    const alert = await this.alertController.create({
        header: "Confirmation",
        message: "<h3>Assigner <span>" + nom + "</span> en tant que V.I.P ? </h3>",
        cssClass : "dimBackdropAlert",
        buttons: [
            {
                text: 'Non',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: 'Oui',
                handler: () => {
                    this.makeVipUser(id);
                    setTimeout(() => {
                        this.ionViewWillEnter();
                        this.sendNotification("Votre modification a été prise en compte !");
                    }, 100);
                }
            }
        ]
    });

    await alert.present();
}

async alertBoxMakeUnVip(id, nom) {
    const alert = await this.alertController.create({
        header: "Confirmation",
        message: "<h3>Désassigner <span>" + nom + "</span> en tant que V.I.P ? </h3>",
        cssClass : "dimBackdropAlert",
        buttons: [
            {
                text: 'Non',
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                }
            }, {
                text: 'Oui',
                handler: () => {
                    this.makeUnVipUser(id);
                    setTimeout(() => {
                        this.ionViewWillEnter();
                        this.sendNotification("Votre modification a été prise en compte !");
                    }, 100);
                }
            }
        ]
    });

    await alert.present();
}

  async alertRoles(id, nom) {
        const alert = await this.alertController.create({
            header: "Confirmation",
            message: "<h3>Assigner <span>" + nom + "</span> en tant que partenaire (propriétaire de bar) ? </h3>",
            cssClass : "dimBackdropAlert",
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Oui',
                    handler: () => {
                        this.updateRole(id);
                        this.createEntreprise(id);
                        setTimeout(() => {
                            this.ionViewWillEnter();
                            this.sendNotification("Votre modification a été prise en compte !");
                        }, 100);
                    }
                }
            ]
        });

        await alert.present();
  }

    async presentAlert(id, nom) {
        const alert = await this.alertController.create({
            header: "Attention !",
            message: "<h3>Êtes vous sûr de vouloir supprimer l'utilisateur: <span>" + nom + "</span> ? </h3>",
            cssClass : "dimBackdropAlert",
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: (blah) => {
                        console.log('Confirm Cancel: blah');
                    }
                }, {
                    text: 'Oui',
                    handler: () => {
                        this.deleteUser(id);
                        setTimeout(() => {
                            this.ionViewWillEnter();
                            this.sendNotification("Votre modification a été prise en compte !");
                        }, 100);
                    }
                }
            ]
        });

        await alert.present();
    }

    async presentAlertSecond(nom) {
        const alert = await this.alertController.create({
            header: "Attention !",
            message: "<h3>Vous ne pouvez pas supprimer l'utilisateur: <span>" + nom + "</span> car il/elle est actuellement abonné/e </h3>",
            cssClass : "dimBackdropAlert",
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                }
            ]
        });

        await alert.present();
    }
  async sendNotification(msg: string) {
      const toast = await this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'top'
      });
      toast.present();
  }

  makeUnVipUser(id){
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'makeUnVipUser', 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

  makeVipUser(id){
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'makeVipUser', 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

  

  deleteUser(id: number) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'deleteUser', 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

  updateRole(id: number) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'updateRole', 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

  createEntreprise (id: number) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'insertEntreprise', 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

    async search(ev: any) {
        const val = ev.target.value;
        console.log(val);
        if (val && val.trim() !== '') {
            this.usersFilter = this.users.filter((users) => {
                return (users.INT_PRENOM.toLowerCase().indexOf(val.toLowerCase()) > -1);
            });
        } else {
            this.getUsers();
        }
    }

    sendEmail(userEmail){

        const email = {
            to: userEmail,
            subject: '',
            body: '',
            isHtml: true
        };

        this.emailComposer.open(email);
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
            this.contentSlideUp = "translateY(100px)";
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
    

    tous(){
        this.usersFilter = this.users;
    
        this.tabPosition = "translateX(0%)";
        this.leftPosition = "0%";
        this.activeColor1 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
        this.activeColor4 = "rgb(82, 82, 82)";
    
        this.tousClicked = true;
        this.abonneClicked = false;
        this.termineClicked = false;
        this.vipClicked = false;
      }
    
      abonne(){
        this.tabPosition = "translateX(-33.33%)";
        this.leftPosition = "33.33%";
        this.activeColor2 = "#fff";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
        this.activeColor4 = "rgb(82, 82, 82)";
    
        this.usersFilter = this.users.filter(function(data : any){
            var ojd = new Date().toISOString();
            return (data.ABO_DATEDEBUT !== null || data.ABO_DATEFIN !== null) && ojd < data.ABO_DATEFIN; 
        });
    
        this.tousClicked = false;
        this.abonneClicked = true;
        this.termineClicked = false;
        this.vipClicked = false;
      }
    
      termine(){
        this.tabPosition = "translateX(-66.67%)";
        this.leftPosition = "66.67%";
        this.activeColor3 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor4 = "rgb(82, 82, 82)";
    
        this.usersFilter = this.users.filter(function(data : any){
            var ojd = new Date().toISOString();
            return (data.ABO_DATEDEBUT !== null || data.ABO_DATEFIN !== null) && ojd > data.ABO_DATEFIN; 
        });   
    
        this.tousClicked = false;
        this.abonneClicked = false;
        this.termineClicked = true;
        this.vipClicked = false;
      }

      vip(){
        this.tabPosition = "translateX(-100%)";
        this.leftPosition = "100%";
        this.activeColor4 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
    
        this.usersFilter = this.users.filter(function(data : any){
            return data.Roles_ROL_ID === 4; 
        });   
    
        this.tousClicked = false;
        this.abonneClicked = false;
        this.termineClicked = false;
        this.vipClicked = true;
      }

}
