import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AborenewService {
  paidUser: string;
  baseURI = "https://www.drinksup.ch/serveur/aksi.php";
  ifHasBeenSubscribed : number = null;
  loggedUser : any = {};
  renewFirst : boolean = false;
  constructor(private http : HttpClient, private storage: Storage, private alertCtrl : AlertController) { }

  triggerRenewal(id, checkDate){
    this.loadData(id);
    this.hasBeenSubscribed(id, checkDate);
    this.getPaidUser(id);
  }

  getPaidUser(id : string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getPaidUser', 'idUser': id},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          this.paidUser = data.validity;
        },  
        (error: any) => {
            console.log(error);
        });
  }

  hasBeenSubscribed(idSession : number, checkDate){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
    options 	: any		= {"key" : "hasBeenSubscribed", "idSession" : idSession},
    url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            this.ifHasBeenSubscribed = data.num;
            this.getAbonnementDetails(idSession, checkDate);
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }

  getAbonnementDetails(userId : number, checkDate){
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getAbonnementDetails','idUser' : userId},
        url: any      	= this.baseURI;
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

      if(data.ABO_TOKEN === null || data.ABO_TOKEN === ""){
        console.log("User' subscription can not be renewed. User doesn't have token from stripe (From aborenew)")
      }else{
        if(this.ifHasBeenSubscribed > 0 && this.paidUser !== "good"){
          if(data.ABO_CANCEL === "NON"){
            console.log("User's subscription is not valid. Autorenewal is being launched... (From aborenew)");
            this.renewAbonnement(data.ABO_PRIX, data.ABO_TYPE, data.ABO_TOKEN, userId, this.loggedUser.INT_PRENOM, this.loggedUser.INT_EMAIL);
          }else{
            console.log("Can't renew. User cancelled his Subscription (From aborenew)");
          }
        }else if(this.ifHasBeenSubscribed > 0 && this.paidUser === "good"){
            console.log("User's subscription is still valid (From aborenew)");
        }else if(this.ifHasBeenSubscribed <= 0){
            console.log("Do nothing, User is not even subbed (From aborenew)")
        }
      }
      //Check Subscription end date);
      var ojd = new Date();
      // ojd.setDate(ojd.getDate() + 23);
      var endDate = new Date(data.ABO_DATEFIN);
      const diffTime = Math.abs(ojd.getTime() - endDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if(checkDate !== null){
        this.storage.get('TriggerOnce').then((value) => {
          if(diffDays<=7){
            console.log("Votre abonnement arrivera bientôt à échéance.");
            if(value === null || value === ""){
              setTimeout(() => {
                if(!this.renewFirst){
                  this.renouvellementMsg("Votre abonnement arrivera bientôt à échéance.")
                  this.storage.set("TriggerOnce", "Yes");
                }
              }, 200);
            }
          }else{
            console.log("Subscription validity is still good")
          }
        });
      }
    },
    (error: any) => {
        console.log(error);
    });
  }

  renewAbonnement(amount, type, token, iduser, nameuser, emailuser){
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'renewAbo','amount' : amount, 'type' : type, 'token': token, 'idInt' : iduser,'nameInt' : nameuser, 'emailInt' : emailuser},
          url: any      	= this.baseURI;
      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
          console.log("Success message :",data)
          
          this.storage.get('TriggerAlertOnce').then((value) => {
            if(value === null || value === ""){
              this.renouvellementMsg(data+" Veuillez rafraîchir la page.");
              this.renewFirst = true;
              this.storage.set("TriggerAlertOnce", "Yes");
            }
          });
      },
      (error: any) => {
          console.log("Error message :",error);
      });
  }

  loadData(idSession : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getUsersById", "idSession" : idSession},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            this.loggedUser = data;
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }

  async renouvellementMsg(msg){
      const alert = await this.alertCtrl.create({
          header: "Information",
          message: "<h3>"+msg+"</h3>",
          cssClass: "alertTables",
          buttons: [
              {
                  text: "OK",
                  handler: () => {
                    this.storage.remove("TriggerAlertOnce");
                  }
              }
          ]
      });

      await alert.present(); 
  }
}
