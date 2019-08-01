import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as moment from "moment";
import {Storage} from "@ionic/storage";
import { LoadedRouterConfig } from '@angular/router/src/config';
import * as Global from '../../app/global';


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
  constructor(public storage: Storage, private http : HttpClient) {
    var currYear = new Date().getFullYear();
    this.storage.set('SessionYearKey', currYear);

    setTimeout(() => {
      this.storage.get('SessionYearKey').then(value => {
        this.chosenYear = value;
      });
    }, 50);
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
          document.getElementById('m_w').style.justifyContent = "flex-start";
          document.getElementById('months_'+(i+1)).style.display = "none";
          document.getElementById('months_'+num).style.height = "100%";
          document.getElementById('mh_'+num).style.height = "35px";
          setTimeout(() => {
            document.getElementById('mb_'+num).style.display = "block"
          }, 100);
          document.getElementById('plusIcon_'+num).innerText = "MOINS";
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
          document.getElementById('plusIcon_'+num).innerText = "PLUS";
      }
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
          document.getElementById('plusIcon_'+(i+1)).innerText = "PLUS";
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

  moreDetails(date){
    document.getElementById("bckdrop").style.display = "block";
    document.getElementById("cmw").style.display = "flex";
    document.getElementById("cm").style.display = "block";

    var newDate = new Date(date);
    var newDateFormat = newDate.getFullYear()+"-"+('0' + (newDate.getMonth()+1)).slice(-2)+"-"+('0' + newDate.getDate()).slice(-2);

    var momNewDate = date.split("T")[0];
    
    this.storage.get('SessionIdKey').then(value => {
      this.getScannedDetails(momNewDate, value);
    });

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
          document.getElementById('plusIcon_'+(i+1)).innerText = "PLUS";
      }
  }

  closeModal(){
    document.getElementById("bckdrop").style.display = "none";
    document.getElementById("cmw").style.display = "none";
    document.getElementById("cm").style.display = "none";
    document.getElementById("cmw2").style.display = "none";
    document.getElementById("cm2").style.display = "none";
  }

  getScannedDetails(dateScanned, userBar){
    let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json'}),
        options 	: any		= {"key" : "getScannedDetails", "proprio" : userBar, "dateScanned" : dateScanned},
        url       : any   = this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data : any) =>
        {
            
            if(data === null){
              console.log("No Data");
              // this.noScannedMonth = "Pas de code scanné pour ce mois-ci.";
              // this.scannedCodesByDate = null;
              this.noDataForMoreDetails = true;

            }else{
              this.scannedCodesDetails = data;
              // this.scannedCodesByDate = data;
              this.noDataForMoreDetails = false;
            }
        },
        (error : any) =>
        {
            console.dir(error);
        });
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

}
