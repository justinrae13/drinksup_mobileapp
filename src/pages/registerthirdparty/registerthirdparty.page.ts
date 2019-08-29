import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastController, NavController, ModalController } from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { LoadingpagePage } from '../loadingpage/loadingpage.page';
import * as Global from '../../app/global';


@Component({
  selector: 'app-registerthirdparty',
  templateUrl: './registerthirdparty.page.html',
  styleUrls: ['./registerthirdparty.page.scss'],
})
export class RegisterthirdpartyPage implements OnInit {
  baseURI = Global.mainURI;
  regURL = 'https://www.futurae-ge.ch/ionic-phpmailer-fb-no-email.php';
  nameParam : string;
  emailParam : string;
  idParam : string;
  nameParamClean : string;
  emailParamClean : string;
  idParamClean : string;
  registerEmailForFB: FormGroup;
  users = [];  
  userDetails : any;
  emailExistReg : boolean = false;
  pushedUserArray : any = [];

  //---------------------------
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';

  uuid : string = "";

  constructor(private modalCtrl : ModalController, private device: Device, private navCtrl: NavController, private storage: Storage, private actRout : ActivatedRoute, private toastCtrl: ToastController, public http: HttpClient, private formBuilder: FormBuilder) { 
    this.registerEmailForFB = new FormGroup({
      REG_EMAIL_FOR_FB : new FormControl()
    });

    this.validationForm();
  }

  validationForm() {
    this.registerEmailForFB = this.formBuilder.group({
        'REG_EMAIL_FOR_FB': ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
    });
}

  ionViewWillEnter(){
    this.uuid = this.device.uuid;
    this.getUsers();
    this.idParam = this.actRout.snapshot.paramMap.get("id");
    this.nameParam = this.actRout.snapshot.paramMap.get("name");
    this.emailParam = this.actRout.snapshot.paramMap.get("email");

    if(this.emailParam!="no-email"){
      this.loadingModal();
      this.idParamClean = this.idParam.substring(1, this.idParam.length -1);//remove double quotes
      this.nameParamClean = this.nameParam.substring(1, this.nameParam.length -1);//remove double quotes
      this.emailParamClean = this.emailParam.substring(1, this.emailParam.length -1);//remove double quotes
      setTimeout(() => {
        this.registerUserFB(this.nameParamClean, this.emailParamClean, this.idParamClean, this.uuid );
      }, 500);
      setTimeout(() => {
          this.LoginForFBUser(this.emailParamClean);
      }, 2500);   
    }
  }

  ngOnInit() {}

  async loadingModal(){
    const modal = await this.modalCtrl.create( {
      component: LoadingpagePage,
      cssClass: "loading-modal",
      showBackdrop : true,
      componentProps: {},
    });
    modal.present();
    setTimeout(() => {
      modal.dismiss();
    }, 2000);
  }

  LoginForFBUser(PRO_EMAIL: string) {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
        options: any		= { 'key' : 'seLoguerUserFacebook', 'PRO_EMAIL' : PRO_EMAIL},
        url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            
            this.userDetails = data;
            console.log(this.userDetails);
            this.storage.set('SessionIdKey', this.userDetails.ID);
            this.storage.set('SessionEmailKey', this.userDetails.EMAIL);
            this.storage.set('SessionInKey', 'Yes');
            if (this.userDetails.ROLE === this.roleAdmin) {
                this.navCtrl.navigateRoot('/tabsadmin/users');
                this.storage.set('SessionRoleKey', this.roleAdmin);
                //check if first login
                this.storage.get('firstLogin').then((val) => {
                    if (val !== null) {
                      console.log("This is not your first time logging into this app");
                    }else {
                          this.storage.set('firstLogin', 'Yes');
                    }
                });
                this.sendNotification('Bienvenue !');
            } else if (this.userDetails.ROLE === this.roleProprio) {
                this.navCtrl.navigateRoot('/tabsproprio/qrcode');
                this.storage.set('SessionRoleKey', this.roleProprio);
                this.sendNotification('Bienvenue !');
            } else if (this.userDetails.ROLE === this.roleUser) {
                this.navCtrl.navigateRoot('/tabs/offers');
                this.storage.set('SessionRoleKey', this.roleUser);
                this.sendNotification('Bienvenue !'); 
            } else {
                // console.log(JSON.stringify(options));
                this.sendNotification('Votre compte Facebook a été déjà utilisé');
            }
        },
        (error: any) => {
            console.log(error);
            this.sendNotification('Erreur!');
        });
}

  registerUserFB(paramName, paramEmail, paramId, uuid){
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'registerFromFB', 'email' : paramEmail, 'name' : paramName, 'idFB' : paramId, 'uuid' : uuid},
            url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            console.log("Registered !");
        },
        (error: any) => {
            console.log(error);
    });
  }

  getUsers() {
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'get_all_users'},
          url: any      	= this.baseURI;
    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
        this.users = data;   
    });
  }

  proceedReg(){
      if(this.emailExistReg){
        setTimeout(() => {
          this.btnSpinnerOff();
        }, 2000);
        setTimeout(() => {
          this.sendNotification("Cette adresse mail a été déjà utilisée");
        }, 2200);
      }else{
          this.confirmThenRegister();
          setTimeout(() => {
            this.btnSpinnerOff();
          }, 2000);
          setTimeout(() => {
            this.sendNotification("Un mail de confirmation vous a été envoyé");
          }, 2200);
      }
  }

  confirmThenRegister() {
    const email : string = this.registerEmailForFB.controls['REG_EMAIL_FOR_FB'].value;

    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'name' :  this.nameParam, 'email' : email, 'id' : this.idParam},
          url: any      	= this.regURL;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            console.log(data);
        },
        (error: any) => {
            console.log(error);
        });
  }

  checkEmailIfExist(){
    const REG_EMAIL: string = this.registerEmailForFB.controls['REG_EMAIL_FOR_FB'].value;
  
    for(var i = 0; i < this.users.length; i++) {
        this.pushedUserArray.push(this.users[i].INT_EMAIL);
    }

    if(this.pushedUserArray.indexOf(REG_EMAIL) > -1){
        this.emailExistReg = true;
        console.log("address mail exist already!");
      }else{
        this.emailExistReg = false;
        console.log("address mail ready!"); 
    }
  } 

  registerMeFB(){
    const REG_EMAIL: string = this.registerEmailForFB.controls['REG_EMAIL_FOR_FB'].value;
    if(REG_EMAIL==""){
      this.sendNotification("Veuillez saisir votre adresse e-mail");      
    }else if(!this.registerEmailForFB.valid && REG_EMAIL!=""){
      this.sendNotification("L'adresse e-mail est invalide");
    }else if(this.emailExistReg && this.registerEmailForFB.valid && REG_EMAIL!=""){
      this.sendNotification("L'adresse e-mail a été déjà utilisée");
    }else{
      this.btnSpinnerOn();
      this.proceedReg();
    }
  }
  

  btnSpinnerOn(){
    //Button
    document.getElementById("customBtnId").style.width = "40px";
    document.getElementById("customBtnId").style.borderBottom = "none";

    document.getElementById("customBtnId").style.backgroundColor = "transparent";
    document.getElementById("customBtnId").style.transitionDelay = ".5s";
    setTimeout(() => {
        document.getElementById("customBtnId").style.animation = "spin .5s linear infinite";    
    }, 750);        
    document.getElementById("customBtnId").style.opacity = "1";

    //Button Ripple
    document.getElementById("rippleEffectId2").style.backgroundColor = "transparent";
    document.getElementById("rippleEffectId2").style.background = "none";

    //Button Text
    setTimeout(() => {
        document.getElementById("cbTextId").style.opacity = "0";
    }, 500);  

}

btnSpinnerOff(){
  //Button
  document.getElementById("customBtnId").style.width = "100%";
  document.getElementById("customBtnId").style.borderBottom = "1px solid #fff";
  document.getElementById("customBtnId").style.backgroundColor = "#fff";
  document.getElementById("customBtnId").style.transitionDelay = "0s";
  document.getElementById("customBtnId").style.animation = "none";
  //Button Ripple
  document.getElementById("rippleEffectId2").style.backgroundColor = "#fff";
  document.getElementById("rippleEffectId2").style.transition = "background 0.8s";
  //Button Text
  document.getElementById("cbTextId").style.display = "block";
  document.getElementById("cbTextId").style.opacity = "1";
  document.getElementById("cbTextId").style.transition = "all .3s linear";
  document.getElementById("cbTextId").style.transitionDelay = "0s"; 

}

retour(){
  this.navCtrl.navigateRoot("/login");
}

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
}

}
