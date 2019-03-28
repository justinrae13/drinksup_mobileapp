import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions } from '@ionic-native/native-page-transitions/ngx';
import { NavController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LoadingpagePage } from '../loadingpage/loadingpage.page';



@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit{
  baseURI = 'https://macfi.ch/serveur/aksi.php';
  uplPhotoURI = "https://www.macfi.ch/serveur/barphotos/";
  items : Array<any> = [];
  log : string;

  constructor(private modalCtrl : ModalController, private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { 
    
    

  }

  ionViewWillEnter(){
    this.storage.get('SessionEmailKey').then((val) => {
      this.loadFaveBar(val);
    });
  }

  ngOnInit() {
    
  }


  loadFaveBar(email_param : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchFaveBar", "email": email_param},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.items = data;
        console.log(data);
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

}
