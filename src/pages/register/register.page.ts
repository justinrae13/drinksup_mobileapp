import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastController, NavController} from '@ionic/angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Storage } from '@ionic/storage';
import * as Global from '../../app/global';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public enregistrerForm: FormGroup;
  public users = [];  
  public baseURI = Global.mainURI;
  public emailExist : boolean = false;
  public emailParam : string;
  public emailClean : string;
  public pushedUserArray : any = [];
  userDetails : any;
  //---------------------------
  roleUser = 'user';
  roleAdmin = 'admin';
  roleProprio = 'proprio';
  //--transitions
  eyeOn : string = "block";
  eyeOff : string = "none";
  inputType : string = "password";

  constructor(private storage: Storage, private actRout : ActivatedRoute, private formBuilder: FormBuilder, private navCtrl: NavController, private toastCtrl: ToastController, public http: HttpClient) {
    this.enregistrerForm = new FormGroup({
        PRO_PRENOM: new FormControl(),
        PRO_PASSWORD: new FormControl(),
    });
    
    this.validationForm();
  }

  showPass(){
    this.eyeOn = "none";
    this.eyeOff = "block";
    this.inputType = "text";
  }

  hidePass(){
    this.eyeOn = "block";
    this.eyeOff = "none";
    this.inputType = "password";
  }

  ngOnInit() {
        this.getUsers();
        this.emailParam = this.actRout.snapshot.paramMap.get("email");
        this.emailClean = this.emailParam.substring(1, this.emailParam.length -1);//remove double quotes

        this.checkEmailIfExist(this.emailClean);
    }

    validationForm() {
        this.enregistrerForm = this.formBuilder.group({
            'PRO_PRENOM': ['', Validators.compose([Validators.required])],
            'PRO_PASSWORD': ['', Validators.compose([Validators.minLength(6), Validators.required])],
        });
    }


    registerME(){
        const PRO_PRENOM: string = this.enregistrerForm.controls['PRO_PRENOM'].value;
        const PRO_PASSWORD: string = this.enregistrerForm.controls['PRO_PASSWORD'].value;
        this.checkEmailIfExist(this.emailClean);

        if(PRO_PRENOM=="" || PRO_PASSWORD ==""){
            this.sendNotification("Les 2 champs sont obligatoires");
        }else if(!this.enregistrerForm.valid && (PRO_PRENOM!="" && PRO_PASSWORD !="")){
            this.sendNotification("Votre mot de passe doit contenir au moins 6 caractères");
        }else{
            this.btnSpinnerOn();
            this.addProprio();
        } 
    }
    

    btnSpinnerOn(){
        document.getElementById("customBtnId").style.width = "40px";
        document.getElementById("customBtnId").style.borderBottom = "none";
        document.getElementById("customBtnId").style.backgroundColor = "transparent";
        document.getElementById("customBtnId").style.transitionDelay = ".3s";
        document.getElementById("customBtnId").style.animation = "spin .5s linear .7s infinite";
        document.getElementById("cbTextId").style.opacity = "0";
        document.getElementById("cbTextId").style.transition = "opacity .2s linear";
        document.getElementById("cbTextId").style.transitionDelay = ".3s";
        
    }

    btnSpinnerOff(){
        document.getElementById("customBtnId").style.width = "100%";
        document.getElementById("customBtnId").style.borderBottom = "1px solid #fff";
        document.getElementById("customBtnId").style.backgroundColor = "#fff";
        document.getElementById("customBtnId").style.transitionDelay = "0s";
        document.getElementById("customBtnId").style.animation = "none";
        document.getElementById("cbTextId").style.opacity = "1";
        document.getElementById("cbTextId").style.transition = "opacity .2s linear";
        document.getElementById("cbTextId").style.transitionDelay = "0s";
    }

   
   

    signUpOwners(nomcomplet: string, email: string, mdp: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
              options: any		= { 'key' : 'enregistrerUser', 'PRO_PRENOM': nomcomplet, 'PRO_EMAIL': email, 'PRO_PASSWORD': mdp},
              url: any      	= this.baseURI;

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                console.log(data);
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }

    //
        getUsers() {
            const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
                options: any		= { 'key' : 'get_all_users'},
                url: any      	= this.baseURI;
            this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
                this.users = data;
            });
        }


        addProprio() {
            const PRO_PRENOM: string = this.enregistrerForm.controls['PRO_PRENOM'].value;
            const PRO_PASSWORD: string = this.enregistrerForm.controls['PRO_PASSWORD'].value;
            // sign up
            if(this.emailExist){
                setTimeout(() => {
                    this.btnSpinnerOff();
                }, 2000);
                setTimeout(() => {
                    this.sendNotification("L'adresse e-mail existe déjà");
                }, 2200);
            }else{
                this.storage.remove("SessionInKey");
                this.storage.remove("SessionRoleKey");
                this.storage.remove("SessionEmailKey");
                this.storage.remove("SessionIdKey");
                this.signUpOwners(PRO_PRENOM, this.emailClean, PRO_PASSWORD);
                setTimeout(() => {
                    this.btnSpinnerOff();
                    document.getElementById("cbTextId").innerHTML = "validé !";
                    document.getElementById("cbTextId").style.color = "#4caf50";
                }, 2000);
                setTimeout(() => {
                    this.LoginForUsers(this.emailClean, PRO_PASSWORD);
                }, 2500);
            }
        }

        checkEmailIfExist(email : string){

            for(var i = 0; i < this.users.length; i++) {
                this.pushedUserArray.push(this.users[i].INT_EMAIL);
            }
    
            if(this.pushedUserArray.indexOf(email) > -1){
                this.emailExist = true;
                console.log("address mail exist already!");
            }else{
                this.emailExist = false;
                console.log("address mail ready!");
            }
            
        }

        LoginForUsers(PRO_EMAIL: string, PRO_PASSWORD: string) {
            const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
                options: any		= { 'key' : 'seLoguerUser', 'PRO_EMAIL' : PRO_EMAIL, 'PRO_PASSWORD' : PRO_PASSWORD},
                url: any      	= this.baseURI;
    
            this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
                {
                    
                    this.userDetails = data;
                    this.storage.set('SessionIdKey', this.userDetails.ID);
                    this.storage.set('SessionEmailKey', this.userDetails.EMAIL);
                    this.storage.set('SessionInKey', 'Yes');
                    if (this.userDetails.ROLE === this.roleAdmin) {
                        this.navCtrl.navigateRoot('/tabsadmin/users');
                        this.storage.set('SessionRoleKey', this.roleAdmin);
                        this.sendNotification('Bienvenue !'); 
                    } else if (this.userDetails.ROLE === this.roleProprio) {
                        this.navCtrl.navigateRoot('/tabsproprio/qrcode');
                        this.storage.set('SessionRoleKey', this.roleProprio);
                        this.sendNotification('Bienvenue !');          
                    } else if (this.userDetails.ROLE === this.roleUser) {
                        this.navCtrl.navigateRoot('/tabs/bars');
                        this.storage.set('SessionRoleKey', this.roleUser);
                        this.sendNotification('Bienvenue !');  
                    } else {
                        // console.log(JSON.stringify(options));
                        this.sendNotification('Email ou mot de passe erroné');
                    }
                },
                (error: any) => {
                    console.log(error);
                    this.sendNotification('Erreur!');
                });
        }


    retour(){
        this.navCtrl.navigateRoot('/login'); 
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
