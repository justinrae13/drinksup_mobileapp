import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { AlertController, IonItemSliding, ModalController, NavController, ToastController, IonContent } from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ModalPage} from '../modal/modal.page';
import * as moment from 'moment';
import 'moment/locale/fr';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import * as Global from '../../app/global';
import { ModalMoreOptionPage } from '../modal-more-option/modal-more-option.page'


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage{
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
  nonabonneClicked : boolean = false;
  termineClicked : boolean = false;

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

  padDeDonee : boolean = false;

  constructor(private modalCtrl : ModalController, private emailComposer: EmailComposer, private navCtrl: NavController, private toastCtrl: ToastController, public http: HttpClient, public modalController: ModalController, public alertController: AlertController) { }

    ionViewWillEnter(){
        //Check if user has internet connection
        if(navigator.onLine){
        //If user has connection
        this.ifHasConnection = true;
        }else{
        //If user has no connection
        this.ifHasConnection = false;
        }

        this.getUsers();
        this.today = new Date().toISOString();
    }

  getUsers() {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'getUsers'},
          url: any      	= this.baseURI;
      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

            data.forEach(function(data : any){
                moment.locale('fr');

                var newStart = moment(data.ABO_DATEDEBUT).format();
                var newEnd = moment(data.ABO_DATEFIN).format();

                if(data.ABO_DATEDEBUT !== null && data.ABO_DATEFIN !== null){
                    data.ABO_DATEDEBUT = newStart;
                    data.ABO_DATEFIN = newEnd;
                }

                var start = data.ABO_DATEDEBUT;
                var end = data.ABO_DATEFIN;

                data.startFR = moment(start).format('D MMMM YYYY à HH:mm');
                data.endFR = moment(end).format('D MMMM YYYY à HH:mm');
            });

            this.users = data;
            this.usersFilter = this.users;

            if (this.usersFilter.length === 0 ){
                this.padDeDonee = true;
            }else{
                this.padDeDonee = false;
            }
      });

  }

  ionViewDidLeave(){
      this.tous();
      this.hideHeader = "0px";
      this.hideSubHeader = "50px";
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

  async editRole(slidingItem: IonItemSliding, id, nom, role) {
      await slidingItem.close();
      this.alertRoles(id, nom, role);
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

  async alertRoles(id, nom, role) {
        var msg = "";
        if(role === 2){
            msg = "<h3>Assigner <span>" + nom + "</span> en tant que partenaire (propriétaire de bar) ? </h3>";
        }else{
            msg = "<h3>Assigner <span>" + nom + "</span> en tant qu'utilisateur ? </h3>";

        }
        const alert = await this.alertController.create({
            header: "Confirmation",
            message: msg,
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
                        this.updateRole(id, role);
                        if(role === 2){
                            this.createEntreprise(id);
                        }else{
                            this.deleteEntreprise(id);
                        }
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

  updateRole(id: number, role : number) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'updateRole', 'id': id, 'role' : role },
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
          console.log("Create entreprise : ", data);
      },
      (error: any) => {
        console.log(error);
        this.sendNotification('Erreur!');
      });
  }

  deleteEntreprise (id: number) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'deleteEntreprise', 'id': id},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        console.log("Delete entreprise : ", data);
    },
    (error: any) => {
        console.log(error);
        this.sendNotification('Erreur!');
    });
  }

    async search(ev: any) {
        const val = ev.target.value;

        if (val && val.trim() !== '') {
            this.usersFilter = this.usersFilter.filter((users) => {
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

    // scrollEvent(event){
    //     let currentScroll = event.detail.scrollTop;
    //     this.scrollOffsetTop = event.detail.scrollTop;
    //     if(this.scrollOffsetTop > 0){
    //         this.maincontent.scrollY = true;
    //     }
        
    //     if(currentScroll > 0 && this.lastScroll <= currentScroll){
    //         this.hideHeader = "-50px";
    //         this.hideSubHeader = "0px";
    //         this.lastScroll = currentScroll;
    //     }else{
    //         this.hideHeader = "0px";
    //         this.hideSubHeader = "50px";
    //         this.lastScroll = currentScroll;
    //     }
    //   }
    
    //   pullstart(e){
    //     this.touchStart = e.changedTouches[0].clientY;
    //   }
    
    //   pull(e){
    //     this.animDur = "0s";
    //     var touchEnd = e.changedTouches[0].clientY;
      
    //     if (this.touchStart > touchEnd) {
    //       this.refresherPosY--;
    //     } else {
    //       this.refresherPosY++;
    //     }
    
    //     //---------------------------------------------
    //     var incPosY = this.refresherPosY*12;
    
    //     if (this.touchStart > touchEnd) {
    
    //     }else {
    //       if(this.scrollOffsetTop == 0){
    //           this.maincontent.scrollY = false;
    //           this.ifPulled = true;
    //           if(incPosY>= 0 && incPosY <= 200){
    //             this.currPosY = incPosY;
    //             this.posY = "translateY("+incPosY+"px)";
    //           }
    //           if(incPosY > 150 && incPosY < 200){
    //             this.maincontent.scrollY = false;
    //           }else{
    //             this.maincontent.scrollY = true;
    //           }
    //       }
    //     }
    //   }
    
    //   endpull(){
    //     this.maincontent.scrollY = true;
    //     if(this.currPosY < 150){
    //       this.refresherPosY = 0;
    //       this.posY = "translateY("+this.refresherPosY+"px)";
    //       this.animDur = "200ms";
    //     }else{
    //       //
    //       if(this.scrollOffsetTop == 0 && this.ifPulled){
    //         this.ifPulled = false; 
    //         this.posY = "translateY("+150+"px)";
    //         this.animDur = "200ms";
    //         this.rotate = "rotate 600ms infinite linear";
    //         this.maincontent.scrollY = false;
    //         this.popFD = "block";
    //         setTimeout(() => {
    //           this.animDur = "500ms";
    //           this.rotate = "none";
    //           this.refresherPosY = 0;
    //           this.posY = "translateY("+this.refresherPosY+"px)";
    //         }, 2200);
      
    //         setTimeout(() => {
    //           this.popFD = "none";
    //           this.mainOpac = "0";
    //           //Put LifeCycle Hooks Here...
    //           this.ionViewWillEnter();
    //           //
    //         }, 2300);
            
    //         setTimeout(() => {
    //           this.mainOpac  = "1";
    //           this.maincontent.scrollY = true;
    //         }, 3000);
    //       }
    //       //
    //     }
        
    //   }
    
    

    tous(){
        this.getUsers();
    
        this.tabPosition = "translateX(0%)";
        this.leftPosition = "0%";
        this.activeColor1 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";
        this.activeColor4 = "rgb(82, 82, 82)";
    
        this.tousClicked = true;
        this.abonneClicked = false;
        this.nonabonneClicked = false;
        this.termineClicked = false;
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
        this.nonabonneClicked = false;
       
        if (this.usersFilter.length === 0 ){
            this.padDeDonee = true;
        }else{
            this.padDeDonee = false;
        }
      }

      nonabonne(){
        this.tabPosition = "translateX(-66.67%)";
        this.leftPosition = "66.67%";
        this.activeColor3 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor4 = "rgb(82, 82, 82)";

        this.usersFilter = this.users.filter(function(data : any){
            return (data.ABO_DATEDEBUT === null || data.ABO_DATEFIN === null) && data.Roles_ROL_ID !== 4; 
        });

        this.tousClicked = false;
        this.abonneClicked = false;
        this.nonabonneClicked = true;
        this.termineClicked = false;

        if (this.usersFilter.length === 0 ){
            this.padDeDonee = true;
        }else{
            this.padDeDonee = false;
        }
      }
    
      termine(){
        this.tabPosition = "translateX(-100%)";
        this.leftPosition = "100%";
        this.activeColor4 = "#fff";
        this.activeColor2 = "rgb(82, 82, 82)";
        this.activeColor1 = "rgb(82, 82, 82)";
        this.activeColor3 = "rgb(82, 82, 82)";

        this.usersFilter = this.users.filter(function(data : any){
            var ojd = new Date().toISOString();
            return (data.ABO_DATEDEBUT !== null || data.ABO_DATEFIN !== null) && ojd > data.ABO_DATEFIN; 
        });   
    
        this.tousClicked = false;
        this.abonneClicked = false;
        this.nonabonneClicked = false;
        this.termineClicked = true;

        if (this.usersFilter.length === 0 ){
            this.padDeDonee = true;
        }else{
            this.padDeDonee = false;
        }
      }

      
      //Open Modal : More option
      async plusDoption(){
        const modal = await this.modalCtrl.create( {
            component: ModalMoreOptionPage,
            cssClass: "edit-profilepic-modal",
            showBackdrop : true
        });
        modal.onDidDismiss().then((role) => {
            console.log(role)
            if(role.data === undefined){
                console.log("Just an ordinary cancellation");
            }else if(role.data == "vip"){
                this.vip();

                this.tabPosition = "translateX(0%)";
                this.leftPosition = "0%";
                this.activeColor1 = "#fff";
                this.activeColor2 = "rgb(82, 82, 82)";
                this.activeColor3 = "rgb(82, 82, 82)";
                this.activeColor4 = "rgb(82, 82, 82)";
            
                this.tousClicked = true;
                this.abonneClicked = false;
                this.nonabonneClicked = false;
                this.termineClicked = false;
            }else if(role.data == "partenaires"){
                this.getPartners();

                this.tabPosition = "translateX(0%)";
                this.leftPosition = "0%";
                this.activeColor1 = "#fff";
                this.activeColor2 = "rgb(82, 82, 82)";
                this.activeColor3 = "rgb(82, 82, 82)";
                this.activeColor4 = "rgb(82, 82, 82)";
            
                this.tousClicked = true;
                this.abonneClicked = false;
                this.nonabonneClicked = false;
                this.termineClicked = false;
            }else{
                console.log("Just an ordinary cancellation");
            }
        })
        modal.present();
    }

    vip(){
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getVIPs'},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
  
                this.usersFilter = data;

                if (this.usersFilter.length === 0 ){
                    this.padDeDonee = true;
                }else{
                    this.padDeDonee = false;
                }
        });
      }


    getPartners() {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'getPartners'},
            url: any      	= this.baseURI;
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
  
                this.usersFilter = data;

                if (this.usersFilter.length === 0 ){
                    this.padDeDonee = true;
                }else{
                    this.padDeDonee = false;
                }
        });

    }
}
