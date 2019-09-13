import { ModalStatsDetailsPage } from "../modal-stats-details/modal-stats-details.page";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent } from "@ionic/angular";
import {Storage} from "@ionic/storage";
import * as Global from '../../app/global';
import * as moment from "moment";


@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  statUser = [];
  stats = [];
  getAllClicks = [];
  lesMois = [];
  scannedCodesByDate = [];
  scannedCodesDetails = [];
  years= [];
  totScanned = [];
  noScannedMonth = "";
  noDataForMoreDetails : boolean = false;
  chosenYear = "";
  maxClick;
  baseURI = Global.mainURI;
  msg = '';
  monthClicked : boolean = false;
  //
  idParam : string;
  
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

  constructor(public storage: Storage, private http: HttpClient, private modalCtrl: ModalController) {
    var currYear = new Date().getFullYear();
    this.storage.set('SessionYearKey', currYear);

    this.storage.get('SessionYearKey').then(value => {
      this.chosenYear = value;
    });

    this.storage.get('SessionIdKey').then(id => {
        this.idParam = id;
    });

   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getYears();
  
    this.lesMois = [
      {nom : "Janvier", num : 1}, 
      {nom : "Février", num : 2}, 
      {nom : "Mars", num : 3}, 
      {nom : "April", num : 4}, 
      {nom : "Mai", num : 5}, 
      {nom : "Juin", num : 6}, 
      {nom : "Juillet", num : 7}, 
      {nom : "Août", num : 8}, 
      {nom : "Septembre", num : 9}, 
      {nom : "Octobre", num : 10}, 
      {nom : "Novembre", num : 11}, 
      {nom : "Décembre", num : 12}, 
    ]

    //Check if user has internet connection
    if(navigator.onLine){
      //If user has connection
      this.ifHasConnection = true;
    }else{
        //If user has no connection
        this.ifHasConnection = false;
    }
  }

  ionViewDidLeave(){
    this.monthClicked = false;
    var childDivs = document.getElementById('m_w').getElementsByTagName('div');
    for( var i=0; i< childDivs.length; i++ ){
        document.getElementById('m_w').style.justifyContent = "space-around";
        document.getElementById('months_'+(i+1)).style.display = "flex";
        document.getElementById('months_'+(i+1)).style.height = "calc(80% / 12)";
        document.getElementById('mh_'+(i+1)).style.height = "100%"
        document.getElementById('mb_'+(i+1)).style.display = "none"
        document.getElementById('plusIcon_'+(i+1)).innerHTML = "<ion-icon name='arrow-dropdown'></ion-icon>";
    }
  }


  getStats(proprio : string){
      let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
          options 	: any		= {"key" : "getStats", "proprio" : proprio},
          url       : any   = this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
          {
              this.statUser = data;
              for(var i = 0; i<data.length; i++){
                this.getAllClicks.push(parseInt(data[i].nbOffre))
              }

              this.maxClick = Math.max(...this.getAllClicks)

              console.log(this.maxClick);
              this.stats = this.statUser;
              if(this.stats == null){
                this.msg = "Vous n'avez pas de statistiques";
              }
          },
          (error : any) =>
          {
              console.dir(error);
          });
  }

  expand(num){
    if(!this.monthClicked){
      this.monthClicked = true;
      //Display number of scanned codes by month
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

      this.storage.get('SessionIdKey').then(id => {
        this.storage.get('SessionYearKey').then(year => {
          this.scannedCode(year, months[num-1], id);
        });
        this.getTot(months[num-1], id);
      });

      //Transitions
      var childDivs = document.getElementById('m_w').getElementsByTagName('div');
      for( var i=0; i< childDivs.length; i++ ){
        var ids = document.getElementById('months_'+(i+1)).getAttribute("id");
        var currId = document.getElementById('months_'+num).getAttribute("id");
        if(ids != currId){
          document.getElementById('months_'+(i+1)).style.display = "none";
          document.getElementById('mh_'+num).style.height = "35px";
       
          document.getElementById('months_'+num).style.height = "100%";
          document.getElementById('m_w').style.justifyContent = "flex-start";
          document.getElementById('plusIcon_'+num).innerHTML = "<ion-icon name='close'></ion-icon>";
     
          setTimeout(() => {
            document.getElementById('mb_'+num).style.display = "block"
            document.getElementById('mb_'+num).style.marginTop = "35px";
          }, 100);

        }
      }
    }else{
      //Transitions
      this.monthClicked = false;
      var childDivs = document.getElementById('m_w').getElementsByTagName('div');
      for( var i=0; i< childDivs.length; i++ ){
          document.getElementById('m_w').style.justifyContent = "space-around";
          document.getElementById('months_'+(i+1)).style.display = "flex";
          document.getElementById('months_'+num).style.height = "calc(80% / 12)";
          document.getElementById('mh_'+num).style.height = "100%"
          document.getElementById('mb_'+(i+1)).style.display = "none"
          document.getElementById('plusIcon_'+num).innerHTML = "<ion-icon name='arrow-dropdown'></ion-icon>";
      }
    }
      
  }

  scannedCode(annee, month, userBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getScannedCodeByMonth", "proprio" : userBar, "mois" : month, "annee" : annee},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            if(data === null){
              console.log("No Data");
              this.noScannedMonth = "Pas de code scanné pour ce mois-ci.";
              this.scannedCodesByDate = null;
            }else{
              console.log(data);
              for(var i in data){
                  var newdate = new Date(data[i].dateScan);
                  var newformatDate = new Date(newdate.getTime() - newdate.getTimezoneOffset()*60000);
                  data[i].dateScan = newformatDate.toISOString();
              }
              this.scannedCodesByDate = data;
            }
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }

  getTot(month, userBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getTotalScanned", "proprio" : userBar, "mois" : month},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            if(data === null){
              console.log("No Data");
            }else{
              this.totScanned = data;
            }
        },
        (error : any) =>
        {
            console.dir(error);
        });
  }

  async moreDetails(date){  

    var momNewDate = date.split("T")[0];
    
    const modal = await this.modalCtrl.create( {
      component: ModalStatsDetailsPage,
      cssClass: "stat-detail",
      showBackdrop : true,
      componentProps: {
        idParam : this.idParam,
        dateParam : momNewDate
      },
    });
    modal.onDidDismiss().then((data) => {
    })
    modal.present();

  }

  changeYear(year){
    this.storage.remove('SessionYearKey');
    setTimeout(() => {
      this.storage.set('SessionYearKey', year);
    }, 50);

    setTimeout(() => {
      this.storage.get('SessionYearKey').then(value => {
        this.chosenYear = value;
      });
      document.getElementById("bckdrop").style.display = "none";
      document.getElementById("cmw2").style.display = "none";
      document.getElementById("cm2").style.display = "none";
    }, 100);
    
  }

  popYears(){
    document.getElementById("bckdrop").style.display = "block";
    document.getElementById("cmw2").style.display = "flex";
    document.getElementById("cm2").style.display = "block";

    this.monthClicked = false;
      var childDivs = document.getElementById('m_w').getElementsByTagName('div');
      for( var i=0; i< childDivs.length; i++ ){
          document.getElementById('m_w').style.justifyContent = "space-around";
          document.getElementById('months_'+(i+1)).style.display = "flex";
          document.getElementById('months_'+(i+1)).style.height = "calc(80% / 12)";
          document.getElementById('mh_'+(i+1)).style.height = "100%"
          document.getElementById('mb_'+(i+1)).style.display = "none"
          document.getElementById('plusIcon_'+(i+1)).innerHTML = "<ion-icon name='arrow-dropdown'></ion-icon>";
      }
  }

  closeModal(){
    document.getElementById("bckdrop").style.display = "none";
    document.getElementById("cmw2").style.display = "none";
    document.getElementById("cm2").style.display = "none";
  }


  getYears(){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getYears"},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
              this.years = data;
        },
        (error : any) =>
        {
            console.dir(error);
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
          this.monthClicked = false;
          var childDivs = document.getElementById('m_w').getElementsByTagName('div');
          for( var i=0; i< childDivs.length; i++ ){
              document.getElementById('m_w').style.justifyContent = "space-around";
              document.getElementById('months_'+(i+1)).style.display = "flex";
              document.getElementById('months_'+(i+1)).style.height = "calc(80% / 12)";
              document.getElementById('mh_'+(i+1)).style.height = "100%"
              document.getElementById('mb_'+(i+1)).style.display = "none"
              document.getElementById('plusIcon_'+(i+1)).innerHTML = "<ion-icon name='arrow-dropdown'></ion-icon>";
          }
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

}
