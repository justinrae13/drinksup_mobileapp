import { Component, OnInit } from '@angular/core';
import {NavController, ToastController, AlertController} from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import * as Global from '../../app/global';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
    resetURL = 'https://www.drinksup.ch/serveur/mailer/reset_password.php';
    baseURI = Global.mainURI;
    users = []; 
    resetPassword: FormGroup;
    resetPasswordSecondForm: FormGroup;
    emailIsRegistered : boolean = false;
    samePassConf : boolean = false;
    pushedUserArray : any = [];
    emailParam : string;
    emailParamClean : string;
    passwordmatch : boolean = false;
    //transitions
    slw = "100%";
    slbg = "#fff";
    slt = "1";
    sls = "none";
    slb = "block";


  constructor(private alertCtrl : AlertController, private formBuilder: FormBuilder, private actRout : ActivatedRoute, private navCtrl: NavController, private toastCtrl: ToastController, public http: HttpClient, private storage: Storage) { 
    this.resetPassword = new FormGroup({
      RESET_PASS_EMAIL : new FormControl()
    });

    this.resetPasswordSecondForm = new FormGroup({
      RESET_PASS_PASS : new FormControl(),
      RESET_PASS_CONF_PASS : new FormControl()
    });
    
    this.validationForm();
  }

  ionViewWillEnter(){
    this.getUsers();
  }

  ngOnInit() {
    this.getUsers();
    this.emailParam = this.actRout.snapshot.paramMap.get("email");

    if(this.emailParam !== null || this.emailParam !== undefined || this.emailParam !== ""){
      this.emailParamClean = this.emailParam.substring(1, this.emailParam.length -1);//remove double quotes
    }else{
      this.emailParamClean = null;
    }
  }

  validationForm() {
    this.resetPassword = this.formBuilder.group({
        'RESET_PASS_EMAIL': ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
    });

    this.resetPasswordSecondForm = this.formBuilder.group({
      'RESET_PASS_PASS': ['', Validators.compose([Validators.minLength(6), Validators.required])],
      'RESET_PASS_CONF_PASS': ['', Validators.compose([Validators.minLength(6), Validators.required])],
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

  proceedReset(){
    if(this.emailIsRegistered){
      this.confirmThenReset();
      //transitions
      this.sls = "none";
      this.slb = "block";
      setTimeout(() => {
          this.slw = "100%";
          this.slbg = "#fff";
      }, 200);
      setTimeout(() => {
          this.slt = "1";
      }, 300);
        
    }else{
      this.sendNotification("L'adresse e-mail non enregistrée");
      //transitions
      this.sls = "none";
      this.slb = "block";
      setTimeout(() => {
          this.slw = "100%";
          this.slbg = "#fff";
      }, 200);
      setTimeout(() => {
          this.slt = "1";
      }, 300);
    }
  }

  confirmThenReset() {
    const email: string = this.resetPassword.controls['RESET_PASS_EMAIL'].value;
    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'email' : email},
          url: any      	= this.resetURL;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            console.log(data);
            if(data == "Sent"){
                setTimeout(() => {
                  this.sendNotification("Un mail de confirmation vous a été envoyé");
                }, 900);
            }else{
                setTimeout(() => {
                  this.sendNotification("Erreur 421. Réessayez ultérieurement");
                }, 900);
            }
        },
        (error: any) => {
            console.log(error);
        });
  }

  checkEmailIfExist(){
    const RESET_PASS_EMAIL: string = this.resetPassword.controls['RESET_PASS_EMAIL'].value;
  
    for(var i = 0; i < this.users.length; i++) {
      if((this.users[i].INT_THIRD_PARTY_LOGIN === null || this.users[i].INT_THIRD_PARTY_LOGIN == "NULL") && (this.users[i].INT_PASSWORD !== null || this.users[i].INT_PASSWORD != "NULL")){
        this.pushedUserArray.push(this.users[i].INT_EMAIL);
      }
    }

    if(this.pushedUserArray.indexOf(RESET_PASS_EMAIL) > -1){
        this.emailIsRegistered = true;
        console.log("address mail exist already!");
    }else{
        this.emailIsRegistered = false;
        console.log("address mail ready!");
    }
  }

  proceedResetPassword(){
    const password: string = this.resetPasswordSecondForm.controls['RESET_PASS_PASS'].value;

    const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'resetPasswordByEmail', 'email' : this.emailParamClean , 'password' : password},
          url: any      	= this.baseURI;

    this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
        {
            console.log(data);
            
               //transitions
              this.sls = "none";
              this.slb = "block";
              setTimeout(() => {
                  this.slw = "100%";
                  this.slbg = "#fff";
              }, 200);
              setTimeout(() => {
                  this.slt = "1";
              }, 300);
              setTimeout(() => {
                this.sendNotification("Votre mot de passe a été modifié avec succès !");
              }, 900);
              setTimeout(() => {
                this.navCtrl.navigateRoot("/login");
              }, 1500);
        },
        (error: any) => {

            console.log(error);
        });
  }

  ifPassSame(){
    const password: string = this.resetPasswordSecondForm.controls['RESET_PASS_PASS'].value;
    const confPass: string = this.resetPasswordSecondForm.controls['RESET_PASS_CONF_PASS'].value;

    if(password!==confPass){
      this.passwordmatch = false;
    }else{
      this.passwordmatch = true;
    }
  }

  async sendNotification(msg: string) {
    const toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
    });
    toast.present();
  }

  retour(){
    this.navCtrl.navigateRoot("/login");
  }

  sendToResetPass(){
    //Check if user has internet connection
    if(navigator.onLine){
      // If user has connection
      if(!this.resetPassword.valid){
        this.sendNotification("L'adresse e-mail est invalide !");
      }else{
        this.slw = "40px";
        this.slbg = "transparent";
        this.slt = "0";
        setTimeout(() => {
            this.slb = "none";
            this.sls = "block";
        }, 290);
  
        setTimeout(() => {
          this.checkEmailIfExist();
          this.proceedReset();
        }, 1000);
      }           
    }else{
      // If user has no connection
        this.alertNoConnection();
    }
    
  }

  resetPass(){
    this.ifPassSame()
    if(!this.resetPasswordSecondForm.valid){
      this.sendNotification("Votre mot de passe doit contenir au moins 6 caractères");
    }else if(!this.passwordmatch){
      this.sendNotification("Les mots de passe ne correspondent pas");
    }else{
      this.slw = "40px";
      this.slbg = "transparent";
      this.slt = "0";
      setTimeout(() => {
          this.slb = "none";
          this.sls = "block";
      }, 290);

      setTimeout(() => {
        this.proceedResetPassword();
      }, 1000);
    }
  }

  async alertNoConnection(){
    const alert = await this.alertCtrl.create({
        header: "Alerte !",
        message: "<h3>Veuillez vous assurer que votre appareil est connecté au réseau.</h3>",
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

}
