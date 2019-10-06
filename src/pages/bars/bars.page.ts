import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonContent, NavController, IonSelect } from "@ionic/angular";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions/ngx';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AborenewService } from '../../app/service/aborenew.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-bars',
  templateUrl: './bars.page.html',
  styleUrls: ['./bars.page.scss'],
})
export class BarsPage implements AfterViewInit{
  @ViewChild(IonContent) content: IonContent;
  @ViewChild("tousFilter") selectTous: IonSelect;
  @ViewChild("tousTopTen") selectTopTen: IonSelect;
  @ViewChild("tousPresDeMoi") selectPresDeMoi: IonSelect;
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
  // contentSlideUp : string = "translateY(100px)";
  tousClicked : boolean = false;
  toptenClicked : boolean = false;
  presdemoiClicked : boolean = false;

  noBarFilter : boolean = false;
  // loaded : boolean = false;
  myLat;
  myLong;
  locationNotAllowed : boolean = false;
  showDistance : boolean = false;
  showRank : boolean = false;

  //
  //Custom Refresher Made By Jutin Rae
  scrollCounter : number = 0;
  highCounter : number = 227;
  mcr_scale : string = "scale(0)";
  mcr_dashoffset : string = "227";
  mcr_trans: string = "0s";
  mcr_svgDisplay : string = "block";
  mcr_circleDivDisplay : string = "none";
  crwDisplay : string = "none";
  mcr_bdDisplay : string = "none";
  lastY : number = 0;

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
  cuspulrefOpac : string = "0";

  //
  initFilterTous : string = null;
  initFilterTopTen : string = null;
  initFilterPresDeMoi : string = null;
  //
  popSpinner : string = "none";
  //
  initTousClicked : boolean = true;

  constructor(private events: Events, private aborenew : AborenewService, private geolocation: Geolocation, private storage : Storage, private http : HttpClient, private nativePageTransitions: NativePageTransitions, private navCtrl : NavController) { 
    this.storage.get('SessionIdKey').then((valId) => {
      this.aborenew.triggerRenewal(valId,"CheckIT");
    });
    //
    // this.mainOpac = "0";
    // this.popSpinner = "flex"; 
    // setTimeout(() => {
    //   this.popSpinner = "none"; 
    //   this.mainOpac = "1";
    // }, 2800);
    //
    setTimeout(() => {
      this.cuspulrefOpac = "1";
    }, 1200);
  }


  ngAfterViewInit(){
    this.loadBar(null, null, null, null, null)
  }


  ionViewDidLeave(){
    this.isSearchbarOpened = false;
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    this.initFilterTous = null;
    this.initFilterTopTen = null;
    this.initFilterPresDeMoi = null;

    //
    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.toptenClicked = false;
    this.presdemoiClicked = false;
    this.noBarFilter = false;

    this.initFilterTopTen = null;
    this.initFilterPresDeMoi = null;

    this.selectTous.value = "all";

    this.showDistance = false;
    this.showRank = false;
    //
    this.loadBar(null, null, null, null, null);
  }


  ionViewWillEnter(){

    this.events.publish("checkLastEntry");

    this.storage.get('SessionIdKey').then((valId) => {
      this.aborenew.triggerRenewal(valId,null);
    });
    
    this.showDistance = false;
    this.showRank = false;
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
    this.getCategorie();

    this.loadOffers();
    this.storage.get('SessionEmailKey').then((val) => {
      this.loadFavorite(val);
    });

    this.geolocation.getCurrentPosition().then((resp) => {
        this.myLat = resp.coords.latitude;
        this.myLong = resp.coords.longitude;

        this.locationNotAllowed = false;
      }).catch((error) => {
        this.locationNotAllowed = true;
    });

    this.checkIfUserConnected();
    this.initTousClicked = true;
  }

  checkIfUserConnected(){
    //Check if user has internet connection
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

  loadBar(toBeFiltered, category, method, myLat, myLong) : void{
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options 	: any		= { "key" : "fetchActiveBar"},
        url       : any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
    {
        this.items = data;
        this.activeBarsNo = this.items.length;

        if(method === null){

          this.Filtereditems = this.items;
          
          this.noBarFilter = false;
          if(toBeFiltered !== null && category !== null){
            this.Filtereditems = this.items.filter((bar) => {
              return (bar.ENT_SECTEURACTIVITES == category);
            });
  
            if(this.Filtereditems.length <= 0){
              this.noBarFilter = true;
            }else{
              this.noBarFilter = false;
            }
          }
        }else if(method === "presdemoi"){

          if(!this.locationNotAllowed){//If location is allowed then calculate the distance
            this.items.forEach(function(data : any){
      
                var radlat1 = Math.PI * myLat/180;
                var radlat2 = Math.PI * data.ENT_LATITUDE/180;
                var theta = myLong-data.ENT_LONGITUDE;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                  dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
                dist = dist * 1.609344;//Kilometers
                
                data.DistanceFromUser = dist;
            });
      
            this.Filtereditems = this.items.sort((a, b) => {//After Calculating the distance, sort it to the nearest
                return a.DistanceFromUser - b.DistanceFromUser;
            });
      
            this.noBarFilter = false;
            if(toBeFiltered !== null && category !== null){
      
              this.Filtereditems = this.Filtereditems.filter((bar) => {
                return (bar.ENT_SECTEURACTIVITES == category);
              });
      
              if(this.Filtereditems.length <= 0){
                this.noBarFilter = true;
              }else{
                this.noBarFilter = false;
              }
      
            }

            this.showDistance = true;
            
          }else{
            this.Filtereditems = undefined;
          }

        }else{
          return false;
        }
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
      console.log("LIST OF FAVORITES ====> ",data);
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
    const imgId_3 = document.getElementById("starIconId3_"+index) as HTMLImageElement;

    const file_3 = "../../assets/img" + imgId_3.src.substring(imgId_3.src.lastIndexOf("/"));
    const liked = "../../assets/img/star-icon-filled.svg";

    if(file_3==liked){
      imgId_3.src ="../../assets/img/star-icon-empty.svg";
      this.storage.get('SessionEmailKey').then((val) => {
        this.deletefavorite(id, val);
      });
    }else{
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
        return (users.ENT_NOM.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      
      this.hideElem = "none";
    }else{
      this.Filtereditems = this.items;
      this.hideElem = "block";
    }
    
  }

  imgLoad(){
    this.disBub = false;
    this.zoomOut = false;
    this.zindex  = "-1";
  }

  scrollEvent(event){
    let currentScroll = event.detail.scrollTop;
    this.scrollOffsetTop = event.detail.scrollTop;

    if(this.scrollOffsetTop > 0){
      this.maincontent.scrollY = true;
    }
    
    if(currentScroll > 0 && this.lastScroll <= currentScroll){
        this.hideHeader = "-50px";
        this.hideSubHeader = "0px";
        // this.contentSlideUp = "translateY(0px)";
        this.lastScroll = currentScroll;
    }else{
        this.hideHeader = "0px";
        this.hideSubHeader = "50px";
        // this.contentSlideUp = "translateY(100px)";
        this.lastScroll = currentScroll;
    }
  }


  pullstart(e){
    this.touchStart = e.changedTouches[0].clientY;
  }

  pull(e){
    this.crwDisplay = "flex";
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
      if(this.scrollOffsetTop ==0){
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
          this.crwDisplay = "none";
          //Put LifeCycle Hooks Here...
          this.checkIfUserConnected();
          if(this.tousClicked){
            
            if(this.initFilterTous === null){
              this.ionViewWillEnter();
              this.ngAfterViewInit();
            }else{
              this.loadBar("tobefiltered", this.initFilterTous, null, null, null);
            }

          }else if(this.toptenClicked){

            if(this.initFilterTopTen === null){
              this.getAllRatings(null,null);
              setTimeout(() => {
                let newFilter = this.Filtereditems.filter((bar) => {
                  return (bar.ENT_SECTEURACTIVITES !== null);
                });

                this.Filtereditems = newFilter;
              }, 100);
            }else{
              this.getAllRatings("tobefiltered", this.initFilterTopTen);
            }

          }else if(this.presdemoiClicked){

            if(this.initFilterPresDeMoi === null){
              // this.presDeMoiCalcul(this.myLat, this.myLong, null, null);
              this.loadBar(null, null, "presdemoi", this.myLat, this.myLong);
              setTimeout(() => {
                let newFilter = this.Filtereditems.filter((bar) => {
                  return (bar.ENT_SECTEURACTIVITES !== null);
                });

                this.Filtereditems = newFilter;
              }, 100);
            }else{
              // this.presDeMoiCalcul(this.myLat, this.myLong, "toBeFiltered", this.initFilterPresDeMoi);
              this.loadBar("tobefiltered", this.initFilterPresDeMoi, "presdemoi", this.myLat, this.myLong);
            }

          }else{
            console.log("Default")
          }
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

  openSearch(){
    let opt : NativeTransitionOptions = {
      duration: 450,
      iosdelay: 100,
      androiddelay: 100
    }
    this.nativePageTransitions.fade(opt); 
    this.navCtrl.navigateForward("/search-a-bar");
  }

  moveToBar(id : string){
    let opt : NativeTransitionOptions = {
      duration: 450,
      iosdelay: 100,
      androiddelay: 100
    }
    this.nativePageTransitions.fade(opt); 
    this.navCtrl.navigateForward('/bar-user/'+id);
    setTimeout(() => {
      this.hideElem = "block";
    }, 500);
    this.hideHeader = "0px";
    this.hideSubHeader = "50px";
  }

  getAllRatings(toBeFiltered, category) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'getAllRatings'},
        url: any      	= this.baseURI;
  
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {

        this.Filtereditems = data;
        this.Filtereditems.forEach(function(data : any, index : number){
            data.ranking = index+1;
        });

        this.noBarFilter = false;
        if(toBeFiltered !== null && category !== null){
          this.Filtereditems = this.Filtereditems.filter((bar) => {
            return (bar.ENT_SECTEURACTIVITES == category);
          });

          if(this.Filtereditems.length <= 0){
            this.noBarFilter = true;
          }else{
            this.noBarFilter = false;
          }
        }
          
        },  
        (error: any) => {
            console.log(error);
        });
  }

  openSelect(selector){
    if(selector=="All"){
      this.selectTous.open();
    }else if(selector=="Top10"){
      this.selectTopTen.open();
    }else if(selector=="Presdemoi"){
      this.selectPresDeMoi.open();
    }else{
      return false;
    }
  }

  filterTous(event){
    //
    this.mainOpac = "0";
    this.popSpinner = "flex"; 
    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //
    setTimeout(() => {
      if(this.Filtereditems === null){
        return false;
      }else{
        if(event.detail.value=="all"){
          this.loadBar(null, null, null, null, null);
          setTimeout(() => {
            this.Filtereditems = this.items.filter((bar) => {
              return (bar.ENT_SECTEURACTIVITES !== null);
            });
          }, 100);
          this.initFilterTous = null;
          this.initFilterTopTen = null;
          this.initFilterPresDeMoi = null;
        }else{
          this.loadBar("tobefiltered", event.detail.value, null, null, null);
          this.initFilterTous = event.detail.value;
          this.initFilterTopTen = null;
          this.initFilterPresDeMoi = null;
        }
      }
    }, 500);
  }

  filterTopTen(event){
    //
    this.mainOpac = "0";
    this.popSpinner = "flex"; 
    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //
    setTimeout(() => {
      if(this.Filtereditems === null){
        return false;
      }else{
        if(event.detail.value=="all"){
          this.getAllRatings(null,null);
          setTimeout(() => {
            this.Filtereditems = this.Filtereditems.filter((bar) => {
              return (bar.ENT_SECTEURACTIVITES !== null);
            });
          }, 100);
          this.initFilterTous = null;
          this.initFilterTopTen = null;
          this.initFilterPresDeMoi = null;
        }else{
          this.getAllRatings("tobefiltered", event.detail.value);
          this.initFilterTous = null;
          this.initFilterPresDeMoi = null;
          this.initFilterTopTen = event.detail.value;
        }
      }
    }, 500);
  }

  filterPresDeMoi(event, myLat, myLong){
    //
    this.mainOpac = "0";
    this.popSpinner = "flex"; 
    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //
    setTimeout(() => {
      if(this.Filtereditems === null){
        return false;
      }else{
        if(event.detail.value=="all"){
          // this.presDeMoiCalcul(myLat, myLong, null, null);
          this.loadBar(null, null, "presdemoi", myLat, myLong)
          setTimeout(() => {
            this.Filtereditems = this.Filtereditems.filter((bar) => {
              return (bar.ENT_SECTEURACTIVITES !== null);
            });
          }, 100);
          this.initFilterTous = null;
          this.initFilterTopTen = null;
          this.initFilterPresDeMoi = null;
        }else{
          // this.presDeMoiCalcul(myLat, myLong, "toBeFiltered", event.detail.value);
          this.loadBar("tobefiltered", event.detail.value, "presdemoi", myLat, myLong);
          console.log("Im filtering")
          this.initFilterTous = null;
          this.initFilterTopTen = null;
          this.initFilterPresDeMoi = event.detail.value;
        }
      }
    }, 500);
  }

  tousLesBars(){
    this.mainOpac = "0";
    this.popSpinner = "flex"; 

    setTimeout(() => {
      this.initFilterTopTen = null;
      this.initFilterPresDeMoi = null;

      this.selectTous.value = "all";

      this.showDistance = false;
      this.showRank = false;
      //
      this.loadBar(null, null, null, null, null);
    },500);

    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //------------------------------
    
    this.tabPosition = "translateX(0%)";
    this.leftPosition = "0%";
    this.activeColor1 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = true;
    this.initTousClicked = true;
    this.toptenClicked = false;
    this.presdemoiClicked = false;
    this.noBarFilter = false;
  }

  topten(){
    this.mainOpac = "0";
    this.popSpinner = "flex";

    setTimeout(() => {
      this.initFilterTous = null;
      this.initFilterPresDeMoi = null;

      this.selectTopTen.value = "all";

      this.showDistance = false;
      this.showRank = true;

      this.getAllRatings(null, null);  
    },500);

    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //------------------------------

    this.tabPosition = "translateX(-50%)";
    this.leftPosition = "50%";
    this.activeColor2 = "#fff";
    this.activeColor1 = "rgb(82, 82, 82)";
    this.activeColor3 = "rgb(82, 82, 82)";

    this.tousClicked = false;
    this.toptenClicked = true;
    this.initTousClicked = false;
    this.presdemoiClicked = false;
    this.noBarFilter = false;
  }

  presdemoi(lat, long){
    this.mainOpac = "0";
    this.popSpinner = "flex";

    setTimeout(() => {
      this.initFilterTous = null;
      this.initFilterTopTen = null;
      
      this.selectPresDeMoi.value = "all";

      this.showRank = false;

      this.loadBar(null, null, "presdemoi", lat, long)
    },500);

    setTimeout(() => {
      this.popSpinner = "none"; 
      this.mainOpac = "1";
    }, 1000);
    //------------------------------
    

    this.tabPosition = "translateX(-100%)";
    this.leftPosition = "100%";
    this.activeColor3 = "#fff";
    this.activeColor2 = "rgb(82, 82, 82)";
    this.activeColor1 = "rgb(82, 82, 82)"; 

    this.tousClicked = false;
    this.toptenClicked = false;
    this.presdemoiClicked = true;
    this.initTousClicked = false;
    this.noBarFilter = false;

  }

  presDeMoiCalcul(myLat, myLong, toBeFiltered, category){
    if(!this.locationNotAllowed){
      this.Filtereditems = this.items;
      this.Filtereditems.forEach(function(data : any){

          var radlat1 = Math.PI * myLat/180;
          var radlat2 = Math.PI * data.ENT_LATITUDE/180;
          var theta = myLong-data.ENT_LONGITUDE;
          var radtheta = Math.PI * theta/180;
          var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
          if (dist > 1) {
            dist = 1;
          }
          dist = Math.acos(dist);
          dist = dist * 180/Math.PI;
          dist = dist * 60 * 1.1515;
          dist = dist * 1.609344;//Kilometers
          
          data.DistanceFromUser = dist;
      });

      this.Filtereditems.sort((a, b) => {
          return a.DistanceFromUser - b.DistanceFromUser;
      });

      this.noBarFilter = false;
      if(toBeFiltered !== null && category !== null){

        this.Filtereditems = this.Filtereditems.filter((bar) => {
          return (bar.ENT_SECTEURACTIVITES == category);
        });

        if(this.Filtereditems.length <= 0){
          this.noBarFilter = true;
        }else{
          this.noBarFilter = false;
        }

      }
      
    }else{
      this.Filtereditems = undefined;
    }
  }

  


  displayNone(){
    setTimeout(() => {
      this.ifLoadedAlready = "none"
    }, 1200);
  }



}
