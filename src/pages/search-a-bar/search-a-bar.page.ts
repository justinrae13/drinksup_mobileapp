import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController, IonSearchbar } from "@ionic/angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';


@Component({
  selector: 'app-search-a-bar',
  templateUrl: './search-a-bar.page.html',
  styleUrls: ['./search-a-bar.page.scss'],
})
export class SearchABarPage implements OnInit {
  @ViewChild(IonSearchbar) searchBarInput: IonSearchbar;
  baseURI = Global.mainURI;
  items : Array<any> = [];
  Filtereditems : Array<any> = [];
  showItems : string = "none";
  filteredItemsZero : boolean = false;

  constructor(private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loadBar();
  }

  backToTheRoots(){
    let options: NativeTransitionOptions = {
      direction: 'right',
      duration: 150,
      slowdownfactor: 3,
      iosdelay: 100,
      androiddelay: 150
     }
    this.nativePageTransitions.slide(options); 
    this.navCtrl.back();
    this.searchBarInput.value = "";
    setTimeout(() => {
      this.showItems = "none";
    }, 500);
  }

  searchBar(param){
    const val = param.target.value;
    if(val.trim()!=""){
      this.Filtereditems = this.items.filter((users) => {
        return (users.ENT_NOM.toLowerCase().indexOf(val.toLowerCase()) > -1);
        
      });
      this.showItems = "block";
      
    }else{
      this.Filtereditems = this.items;
      this.showItems = "none";
    }

    if(this.Filtereditems.length <= 0){
      this.filteredItemsZero = true;
    }else{
      this.filteredItemsZero = false;
    }    
  }

  loadBar() : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchActiveBar"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.items = data;
        this.Filtereditems = this.items;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  moveToBar(id : string){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 150,
    //   slowdownfactor: 3,
    //   iosdelay: 100,
    //   androiddelay: 150
    //  }
    this.nativePageTransitions.fade(null); 
    this.navCtrl.navigateForward('/bar-user/'+id);
    setTimeout(() => {
      this.showItems = "none";
    }, 500);
  }

}
