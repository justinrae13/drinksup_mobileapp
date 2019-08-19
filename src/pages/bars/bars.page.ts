import { Component, ViewChild } from '@angular/core';
import { IonContent, NavController, IonSelect } from "@ionic/angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.page.html',
  styleUrls: ['./bars.page.scss'],
})
export class BarsPage{
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSelect) selectRef: IonSelect;
  customActionSheetOptions: any = {
    header: 'Filtrer par catégorie',
  };
  baseURI = Global.mainURI;
  uplPhotoURI = Global.photosURI;
  items : Array<any> = [];
  offers : Array<any> = [];
  offerIds : Array<any> = [];
  Filtereditems : Array<any> = [];
  faveBars : Array<any> = [];
  allCategories = [];
  seshId : number;
  random : number;
  disBub : boolean = true;
  zoomOut : boolean = true;
  activeBarsNo  : number;
  isSearchbarOpened : boolean = false; 
  addedToFave : boolean = false;
  hideElem : string = "block";
  emptyVal : string;
  zindex : string = "5";
  ifLoadedAlready : string = "block";

  tabPosition : string = "translateX(0)";
  leftPosition : string = "0%";
  activeColor1 : string = "#fff";
  activeColor2 : string = "rgb(82, 82, 82)";
  activeColor3 : string = "rgb(82, 82, 82)";
  lastScroll : number = 0;
  hideHeader : string = "0";
  hideSubHeader: string = "50px";
  tousClicked : boolean = false;
  toptenClicked : boolean = false;
  presdemoiClicked : boolean = false;

  noBarFilter : boolean = false;
  // loaded : boolean = false;

  constructor(private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { 
    this.loadBar();
    this.random = Math.floor(Math.random() * 100);
  }
  
  // scrollToTop() {
  //   this.content.scrollToTop(0);
  // }

  // ionViewDidEnter(){
  //   this.scrollToTop();
  // }

  ionViewDidLeave(){
    this.isSearchbarOpened = false;
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    
    this.selectRef.value = "all";
  }


  ionViewWillEnter(){
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    this.getCategorie();
    this.loadBar();
    this.loadOffers();
    this.storage.get('SessionEmailKey').then((val) => {
      this.loadFavorite(val);
    });
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

  loadBar() : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchActiveBar"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.items = data;
        this.Filtereditems = this.items;
        console.log(this.Filtereditems)
        this.activeBarsNo = this.items.length;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  loadOffers() : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "getAllOffers"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
      if(data === null){
        return false;
      }else{
        this.offers = data;
        for(var i = 0; i<data.length; i++){
          this.offerIds.push(data[i].Entreprises_ENT_ID);
        }
      }
        

    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  favorite(id_param : number, email_param : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "addFavorite", "id" : id_param, "email" : email_param},
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

  loadFavorite(email_param : string){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "loadFavorite", "email" : email_param},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
      this.faveBars = data;
    },
    (error : any) =>
    {
      console.log(error);
    });
  }

  addRemoveFave(index, id){

    // const imgId_1 = document.getElementById("starIconId1_"+index) as HTMLImageElement;
    // const imgId_2 = document.getElementById("starIconId2_"+index) as HTMLImageElement;
    const imgId_3 = document.getElementById("starIconId3_"+index) as HTMLImageElement;

    // const file_1 = "../../assets/img" + imgId_1.src.substring(imgId_1.src.lastIndexOf("/"));
    // const file_2 = "../../assets/img" + imgId_2.src.substring(imgId_2.src.lastIndexOf("/"));
    const file_3 = "../../assets/img" + imgId_3.src.substring(imgId_3.src.lastIndexOf("/"));
    const liked = "../../assets/img/star-icon-filled.svg";

    if(file_3==liked){
      // imgId_1.src ="../../assets/img/star-icon-empty.svg";
      // imgId_2.src ="../../assets/img/star-icon-empty.svg";
      imgId_3.src ="../../assets/img/star-icon-empty.svg";
      this.storage.get('SessionEmailKey').then((val) => {
        this.deletefavorite(id, val);
      });
    }else{
      // imgId_1.src ="../../assets/img/star-icon-filled.svg";
      // imgId_2.src ="../../assets/img/star-icon-filled.svg";
      imgId_3.src ="../../assets/img/star-icon-filled.svg";
      this.storage.get('SessionEmailKey').then((val) => {
        this.favorite(id, val);
      });
    }
    
  }


  ifFave(id) : boolean{
    if(this.faveBars!=null){
      for(var i=0; i < this.faveBars.length; i++){
        if(this.faveBars[i].FAV_BAR_ID == id){
          return true;
        }
      }
    }
  }

  ifHasOffer(id) : boolean{
      for(var i=0; i < this.offers.length; i++){
        if(this.offers[i].Entreprises_ENT_ID == id){
          return true;
        }
      }
  }

  searchBar(param){
    const val = param.target.value;
    if(val.trim()!=""){
      this.Filtereditems = this.items.filter((users) => {
        console.log('valeur de la recherche ' + val);
        console.log(this.Filtereditems.length);
        return (users.ENT_NOM.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      
      this.hideElem = "none";
    }else{
      this.Filtereditems = this.items;
      this.hideElem = "block";
    }
    
  }

  openSelect(){
    this.selectRef.open();
  }

  filterByType(event){
    if(this.Filtereditems === null){
      return false;
    }else{
      if(event.detail.value=="all"){
        this.Filtereditems = this.items;
      }else{
        this.Filtereditems = this.items.filter((bar) => {
          return (bar.ENT_SECTEURACTIVITES == event.detail.value);
        });
      }
    }

    if(this.Filtereditems.length <= 0){
      this.noBarFilter = true;
    }else{
      this.noBarFilter = false;
    }
  }

  imgLoad(){
    this.disBub = false;
    this.zoomOut = false;
    this.zindex  = "-1";
  }

  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;
    
    if(currentScroll > 0 && this.lastScroll <= currentScroll){
        this.hideHeader = "-50px";
        this.hideSubHeader = "0px";
        this.lastScroll = currentScroll;
    }else{
        this.hideHeader = "0px";
        this.hideSubHeader = "50px";
        this.lastScroll = currentScroll;
    }
  }


  openSearch(){
    // let options: NativeTransitionOptions = {
    //   direction: 'left',
    //   duration: 150,
    //   slowdownfactor: 3,
    //   iosdelay: 100,
    //   androiddelay: 150
    //  }
    this.nativePageTransitions.fade(null); 
    this.navCtrl.navigateForward("/search-a-bar");
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
    //  this.nativePageTransitions.slide(options); 
    this.navCtrl.navigateForward('/bar-user/'+id);
    setTimeout(() => {
      this.hideElem = "block";
    }, 500);
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
  }

  getAllRatings() {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getAllRatings'},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.Filtereditems = data;
          
        },  
        (error: any) => {
            console.log(error);
        });
  }

  tousLesBars(){
    this.Filtereditems = this.items;

    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.toptenClicked = false;
    this.presdemoiClicked = false;
    this.noBarFilter = false;
  }

  topten(){
    this.tabPosition = "translateX(-50%)";
    this.leftPosition = "50%";
    this.activeColor2 = "#fff";
    this.activeColor1 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";
    this.getAllRatings();
    // this.Filtereditems = this.items.filter(function(data : any){
    //   var today = new Date().getTime();
    //   var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
    //   return today>dateStart; 
    // });

    this.tousClicked = false;
    this.toptenClicked = true;
    this.presdemoiClicked = false;
    this.noBarFilter = false;
  }

  presdemoi(){
    this.tabPosition = "translateX(-100%)";
    this.leftPosition = "100%";
    this.activeColor3 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor1 = "rgb(82, 82, 82)";

    // this.Filtereditems = this.items.filter(function(data : any){
    //   var today = new Date().getTime();
    //   var dateStart = new Date(data.OFF_DATEDEBUT).getTime();
    //   return today<dateStart; 
    // });   

    this.tousClicked = false;
    this.toptenClicked = false;
    this.presdemoiClicked = true;
    this.noBarFilter = false;
  }


  displayNone(){
    setTimeout(() => {
      this.ifLoadedAlready = "none"
    }, 1200);
  }


}
