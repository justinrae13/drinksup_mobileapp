import { Component } from '@angular/core';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { NavParams, ModalController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Global from '../../app/global';

@Component({
  selector: 'app-modal-get-sponsored',
  templateUrl: './modal-get-sponsored.page.html',
  styleUrls: ['./modal-get-sponsored.page.scss'],
})
export class ModalGetSponsoredPage{
  baseURI = Global.mainURI;
  sponsorsCode : string = "- - - - - - -";
  myCode : string = null;
  myId : number = null;
  the_code_exists : boolean = false;
  if_already_sponsored : boolean = false;

  constructor(private http : HttpClient, private toastCtrl : ToastController, private navParam : NavParams, private modalCtrl : ModalController, private clipboard: Clipboard) { }

  ionViewWillEnter() {
    this.myCode = this.navParam.get('codeParam');
    this.myId = this.navParam.get('idParam');
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
  }

  
  pasteTheCode(myId){

      var check = "";
      var clipBoardMsg = "";
      var txt = "";
      var nowhitespaces = "";

      this.clipboard.paste().then(
          (resolve: string) => {
              clipBoardMsg = resolve;

              //Condition
              check = clipBoardMsg.substring(0,3);
              if(check==="DU-"){
                  this.sponsorsCode = clipBoardMsg.replace(/\s/g,'');
                  //
                  this.checkIfCodeExists(clipBoardMsg.replace(/\s/g,''));
                  this.checkIfAlreadySponsored(clipBoardMsg.replace(/\s/g,''), myId);

              }else if(check==="Tél"){
                  clipBoardMsg = clipBoardMsg.split("l'appli : ").pop();
                  txt = clipBoardMsg.split('Tu peux').shift();
                  nowhitespaces = txt.replace(/\s/g,'');

                  this.sponsorsCode = nowhitespaces;
                  //
                  this.checkIfCodeExists(nowhitespaces);
                  this.checkIfAlreadySponsored(nowhitespaces, myId);

              }else{
                  this.sendNotification("Veuillez assurer que vous avez copié le message en entier ou le bon code.");
              }

            },
            (reject: string) => {
              console.log('Error: ' + reject);
            }
      );
  }

  getSponsored(myCode, myId){
    if(myCode === this.sponsorsCode){
      this.sendNotification("Vous ne pouvez utiliser votre propre code !");
    }else if(!this.the_code_exists){
        this.sendNotification("Le code est invalide. Veuillez vérifier si vous avez bien saisi le bon code.");
    }else if(this.sponsorsCode === "- - - - - - -"){
        this.sendNotification("Le code est invalide. Veuillez vérifier si vous avez bien saisi le bon code.");
    }else if(this.the_code_exists ){
        if(!this.if_already_sponsored){
            this.addSponsorship(this.sponsorsCode, myId);
            setTimeout(() => {
                this.closeModal();
            }, 1000);
        }else{
            this.sendNotification("Erreur !\nVous avez déjà utilisé le code de cet utilisateur.");
        }
    }else{
        return false;
    }
  }

  //HTTPS Requests
  addSponsorship(code_of_sponsor : string, id_of_sponsored : number) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'addSponsorship', 'code': code_of_sponsor, 'id' : id_of_sponsored},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.sendNotification(data);
    },  
    (error: any) => {
        console.log(error);
    });
}

  checkIfCodeExists(code : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'checkIfCodeExists', 'code': code},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        if(data.num > 0){
            this.the_code_exists = true;
        }else{
            this.the_code_exists = false;
        }
    },  
    (error: any) => {
        console.log(error);
    });
}

checkIfAlreadySponsored(code_of_sponsor : string, id_of_sponsored : number) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'checkIfAlreadySponsored', 'code': code_of_sponsor, 'id' : id_of_sponsored},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        if(data.num > 0){
            this.if_already_sponsored = true;
        }else{
            this.if_already_sponsored = false;
        }
    },  
    (error: any) => {
        console.log(error);
    });
}

}
