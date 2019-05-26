import { Component, OnInit } from '@angular/core';
import {Facebook, FacebookLoginResponse} from '@ionic-native/facebook/ngx';
import {NavController, ToastController} from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    userData: any;
    userfb: any = {};
    userdatafb: any;
    loginForm: FormGroup;
    registerEmail: FormGroup;
    baseURI = 'https://macfi.ch/serveur/';
    regURL = 'https://www.futurae-ge.ch/ionic-phpmailer.php';
    userDetails : any;
    users = [];  
    fbIdExist : boolean = false;
    emailExist : boolean = false;
    emailExistReg : boolean = false;
    pushedUserArray : any = [];
    pushedIdFbArray : any = [];

    //---------------------------
    roleUser = 'user';
    roleAdmin = 'admin';
    roleProprio = 'proprio';

    //----------------------------
    activeSignUp = "none";
    activeSignIn = "block";
    //--transitions
  
    formLog = "none";
    slideUP = "slide-up .5s ease-out forwards";
    slideUP2 = "slide-up .5s ease-out forwards";
    su_t = "translateY(30px)";
    su_t2 = "translateY(30px)";
    su_opac = "0";
    formReg = "none";

    constructor(private fb: Facebook, private route: Router, private formBuilder: FormBuilder, private navCtrl: NavController, private googlePlus : GooglePlus, private toastCtrl: ToastController, public http: HttpClient, private storage: Storage) {
        this.loginForm = new FormGroup({
            PRO_EMAIL: new FormControl(),
            PRO_PASSWORD: new FormControl(),
        });

        this.registerEmail = new FormGroup({
            REG_EMAIL : new FormControl()
        });

        this.validationForm();
         
        
    }

    ngOnInit() {
        this.getUsers();
    }

    ionViewWillEnter(){
        setTimeout(() => {
            this.formLog = "block";
        }, 2100);
        this.loginForm.controls['PRO_EMAIL'].setValue("");
        this.loginForm.controls['PRO_PASSWORD'].setValue("");
    }

    ionViewDidLeave(){
        this.formLog = "none";
        this.slideUP = "slide-up .5s ease-out forwards";
        this.su_t = "translateY(30px)";
        this.su_opac ="0";
        // document.getElementById("regText").innerHTML = "Envoyer";
        // document.getElementById("regText").style.color = "rgb(61, 61, 61)";
    } 
    
    validationForm() {
        this.loginForm = this.formBuilder.group({
            'PRO_EMAIL': ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
            'PRO_PASSWORD': ['', Validators.compose([Validators.minLength(6), Validators.required])]
        });

        this.registerEmail = this.formBuilder.group({
            'REG_EMAIL': ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
        });
    }

    getUsers() {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
              options: any		= { 'key' : 'get_all_users'},
              url: any      	= this.baseURI + 'aksi.php';
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
            this.users = data;   
        });
    }

    loginWithFB(){
        this.fb.login(['public_profile','email']).then((res : FacebookLoginResponse)=>{
            if(res.status==='connected'){
                this.userfb.img = 'https://graph.facebook.com/'+res.authResponse.userID+'/picture?type=large';
                this.fb.api('me?fields=id,name,first_name,last_name,email',[]).then(profile =>{
                    this.userdatafb = {email : profile['email'], id : profile['id'], name : profile['name']};
                    //Check if email from fb is obtainable
                    if(this.userdatafb.email===undefined || this.userdatafb.email === null || this.userdatafb.email === ""){
                        //Check if fb without email is already registered
                        for(var i = 0; i < this.users.length; i++) {
                            this.pushedIdFbArray.push(this.users[i].INT_FB_ID);
                        }
                        if(this.pushedIdFbArray.indexOf(this.userdatafb.id) > -1){
                            this.fbIdExist = true;
                            console.log("Facebook Id is already used!");
                        }else{
                            this.fbIdExist = false;
                            console.log("Facebook Id ready!");
                        }

                        //If fb id exists then user is accepted and must be logged in
                        if(this.fbIdExist){
                            this.LoginForFBUserWithID(this.userdatafb.id);
                        }else{
                        // else it should be registered
                            this.navCtrl.navigateForward("registerthirdparty/"+this.userdatafb.name+"/no-email/"+this.userdatafb.id);
                        }
                    }else{
                        //Check if address mail logged from facebook exist in the database
                        for(var i = 0; i < this.users.length; i++) {
                            this.pushedUserArray.push(this.users[i].INT_EMAIL);
                        }

                        if(this.pushedUserArray.indexOf(this.userdatafb.email) > -1){
                            this.emailExist = true;
                            console.log("address mail exist already!");
                        }else{
                            this.emailExist = false;
                            console.log("address mail ready!");
                        }
                        //If email exists then user is accepted and must be logged in
                        if(this.emailExist){
                            this.LoginForFBUser(this.userdatafb.email);
                        }else{
                        // else it should be registered
                            this.registerUserFB(this.userdatafb.name, this.userdatafb.email);
                            setTimeout(() => {
                                this.LoginForFBUser(this.userdatafb.email);
                            }, 500);   
                        }
                    }
                });
            }else{
                this.sendNotification("Échec de connexion Facebook");
            }
            console.log("login fb successful !", res);
        }).catch(e=> console.log("Error logging into Facebook", e));
    }

    loginWithGoogle() {
        this.googlePlus.login({})
        .then(res => {

          //Check if address mail logged from google exist in the database
            for(var i = 0; i < this.users.length; i++) {
                this.pushedUserArray.push(this.users[i].INT_EMAIL);
            }
        
            if(this.pushedUserArray.indexOf(res.email) > -1){
                this.emailExist = true;
                console.log("address mail exist already!");
            }else{
                this.emailExist = false;
                console.log("address mail ready!");
            }
            //If email exists then user is accepted and must be logged in
            if(this.emailExist){
                this.LoginForGoogleUser(res.email);
            }else{
            // else it should be registered
                this.registerFromGoogle(res.email, res.givenName, res.familyName);
                setTimeout(() => {
                    this.LoginForGoogleUser(res.email);
                }, 500);   
            }

          })
        .catch(err => console.error(err));    
    }

    LoginForUsers(PRO_EMAIL: string, PRO_PASSWORD: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'seLoguerUser', 'PRO_EMAIL' : PRO_EMAIL, 'PRO_PASSWORD' : PRO_PASSWORD},
            url: any      	= this.baseURI + 'aksi.php';

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
            {
                
                this.userDetails = data;
                this.storage.set('SessionIdKey', this.userDetails.ID);
                this.storage.set('SessionEmailKey', this.userDetails.EMAIL);
                this.storage.set('SessionInKey', 'Yes');
                if (this.userDetails.ROLE === this.roleAdmin) {
                    
                    this.storage.set('SessionRoleKey', this.roleAdmin);
                    //transitions
                    document.getElementById("seConnTextId").innerHTML = "OK !";
                    document.getElementById("seConnTextId").style.color = "#4caf50";
                    this.btnAnim_1_Off();
                    setTimeout(() => {
                        this.navCtrl.navigateRoot('/tabsadmin/users');
                        this.sendNotification('Bienvenue !');
                    }, 500);
                } else if (this.userDetails.ROLE === this.roleProprio) {
                    
                    this.storage.set('SessionRoleKey', this.roleProprio);
                    //transitions
                    document.getElementById("seConnTextId").innerHTML = "OK !";
                    document.getElementById("seConnTextId").style.color = "#4caf50";
                    this.btnAnim_1_Off();
                    setTimeout(() => {
                        this.navCtrl.navigateRoot('/tabsproprio/qrcode');
                        this.sendNotification('Bienvenue !');
                    }, 500); 
                } else if (this.userDetails.ROLE === this.roleUser) {
                    this.storage.set('SessionRoleKey', this.roleUser);
                    //transitions
                    document.getElementById("seConnTextId").innerHTML = "OK !";
                    document.getElementById("seConnTextId").style.color = "#4caf50";
                    this.btnAnim_1_Off();
                    setTimeout(() => {
                        this.navCtrl.navigateRoot('/tabs/offers');
                        this.sendNotification('Bienvenue !');
                    }, 500);
                } else {
                    
                    //transitions
                    this.btnAnim_1_Off()
                    setTimeout(() => {
                        this.sendNotification('Email ou mot de passe erroné');
                    }, 500);
                }
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }

    loginUsers() {
        const PRO_EMAIL: string = this.loginForm.controls['PRO_EMAIL'].value,
              PRO_PASSWORD: string = this.loginForm.controls['PRO_PASSWORD'].value;
        this.LoginForUsers(PRO_EMAIL, PRO_PASSWORD);
             
    }

    LoginForGoogleUser(PRO_EMAIL: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'seLoguerUserGoogle', 'PRO_EMAIL' : PRO_EMAIL},
            url: any      	= this.baseURI + 'aksi.php';

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
                    this.googlePlus.logout().then(res => {console.log(res);}).catch(err => console.error(err));
                    this.sendNotification('Votre adresse Google+ a été déjà utilisé via inscription native de Drinks Up. Si vous ne vous souvenez plus de votre mot de passe. Veuillez cliquer sur "Mot de passe oublié"');
                }
            },
            (error: any) => {
                console.log(error);
                this.sendNotification('Erreur!');
            });
    }

    LoginForFBUser(PRO_EMAIL) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'seLoguerUserFacebook', 'PRO_EMAIL' : PRO_EMAIL},
            url: any      	= this.baseURI + 'aksi.php';
    
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

    LoginForFBUserWithID(PRO_FB_ID) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'seLoguerUserFacebookID', 'PRO_FB_ID' : PRO_FB_ID},
            url: any      	= this.baseURI + 'aksi.php';
    
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
    

    registerFromGoogle(param_email: string, param_firstname: string, param_name: string) {
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
            options: any		= { 'key' : 'registerFromGoogle', 'email' : param_email, 'firstname' : param_firstname, 'name' : param_name},
            url: any      	= this.baseURI + 'aksi.php';

        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
            {
                console.log("Registered !");
            },
            (error: any) => {
                console.log(error);
            });
    }

    registerUserFB(paramName, paramEmail){
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
                options: any		= { 'key' : 'registerFromFB', 'email' : paramEmail, 'name' : paramName},
                url: any      	= this.baseURI + 'aksi.php';
    
        this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) =>
            {
                console.log("Registered !");
            },
            (error: any) => {
                console.log(error);
        });
      }

    proceedReg(){
        if(this.emailExistReg){
            this.sendNotification("L'adresse e-mail existe déjà");
        }else{
            this.confirmThenRegister();
            this.sendNotification("Un mail de confirmation vous a été envoyé");
        }
    }

    confirmThenRegister() {
        const email : string = this.registerEmail.controls['REG_EMAIL'].value;
        const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
              options: any		= { 'email' : email},
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
        const REG_EMAIL: string = this.registerEmail.controls['REG_EMAIL'].value;
      
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

    forgotPass(){
        this.navCtrl.navigateForward("forgot-password");
    }

    async sendNotification(msg: string) {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    async navTabs(msg: string) {
        this.route.navigateByUrl(msg);
    }

    //animations
    seConnecter(){
        const PRO_EMAIL: string = this.loginForm.controls['PRO_EMAIL'].value,
              PRO_PASSWORD: string = this.loginForm.controls['PRO_PASSWORD'].value;
              
        
        if(PRO_EMAIL=="" && PRO_PASSWORD==""){
            this.sendNotification("Veuillez remplir tous les champs pour pouvoir vous connectez")
        }else{
            this.btnAnim_1_on();
            setTimeout(() => {
                this.loginUsers();
            }, 2000);
        }
    }

    sendToRegister(){
        this.checkEmailIfExist();

        if(!this.registerEmail.valid){
            this.sendNotification("L'adresse e-mail est invalide !")
        }else if(this.emailExistReg && this.registerEmail.valid){
            //transitions
            setTimeout(() => {
                this.btnAnim_2_on();
            }, 300);
            setTimeout(() => {
                this.btnAnim_2_Off();
                this.sendNotification("Cette adresse e-mail a été déjà utilisée");
            }, 2000);
        
        }else{
            //transitions
            setTimeout(() => {
                this.btnAnim_2_on();
            }, 300);

            setTimeout(() => {
                document.getElementById("regTextId").innerHTML = "validé&nbsp;!";
                document.getElementById("regTextId").style.color = "#4caf50";
                this.btnAnim_2_Off();
                this.confirmThenRegister();
                this.sendNotification("Un mail de confirmation vous a été envoyé");
            }, 2000);         
        }    
    }

    
    signup(){
        this.slideUP = "slide-down .5s ease-out forwards"
        this.su_t = "translateY(0)";
        document.getElementById("ad2").classList.remove("ad2");
        document.getElementById("ad3").classList.remove("ad3");
        document.getElementById("ad4").classList.remove("ad4");
        document.getElementById("ad5").classList.remove("ad5");
        document.getElementById("ad6_id").classList.remove("ad6");
        document.getElementById("ad7").classList.remove("ad7");
        document.getElementById("ad8").classList.remove("ad8");
        //
        document.getElementById("ad2_2").classList.add("ad2_2");
        document.getElementById("ad3_2").classList.add("ad3_2");
        document.getElementById("ad4_2").classList.add("ad4_2");
        document.getElementById("ad5_2").classList.add("ad5_2");
        setTimeout(() => {
            this.formLog = "none";
            this.formReg = "block";
            this.slideUP2 = "slide-up .5s ease-out forwards"
            this.su_t2 = "translateY(0)";
            this.su_opac = "0";
        }, 510);

    }

    signin(){
        this.slideUP2 = "slide-down .5s ease-out forwards"
        this.su_t2 = "translateY(0)";
        document.getElementById("ad2_2").classList.remove("ad2_2");
        document.getElementById("ad3_2").classList.remove("ad3_2");
        document.getElementById("ad4_2").classList.remove("ad4_2");
        document.getElementById("ad5_2").classList.remove("ad5_2");
        //
        document.getElementById("ad2").classList.add("ad2");
        document.getElementById("ad3").classList.add("ad3");
        document.getElementById("ad4").classList.add("ad4");
        document.getElementById("ad5").classList.add("ad5");
        document.getElementById("ad6_id").classList.add("ad6");
        document.getElementById("ad7").classList.add("ad7");
        document.getElementById("ad8").classList.add("ad8");
        setTimeout(() => {
            this.formLog = "block";
            this.formReg = "none";
            this.slideUP = "slide-up .5s ease-out forwards"
            this.su_t = "translateY(0)";
            this.su_opac = "0";

        }, 510);
        
    }


    btnAnim_1_on(){
        //Button
        document.getElementById("seConnBtnId").style.width = "40px";
        document.getElementById("seConnBtnId").style.borderBottom = "none";
        document.getElementById("seConnBtnId").style.backgroundColor = "transparent";
        document.getElementById("seConnBtnId").style.transitionDelay = ".5s";
        setTimeout(() => {
            document.getElementById("seConnBtnId").style.animation = "spin .5s linear infinite";    
        }, 750);        
        document.getElementById("seConnBtnId").style.opacity = "1";

        //Button Ripple
        document.getElementById("rippleEffectId").style.backgroundColor = "transparent";
        //Button Text
        setTimeout(() => {
            document.getElementById("seConnTextId").style.opacity = "0";
        }, 500);
    }

    btnAnim_1_Off(){
        //Button
        document.getElementById("seConnBtnId").style.width = "100%";
        document.getElementById("seConnBtnId").style.borderBottom = "1px solid #fff";
        document.getElementById("seConnBtnId").style.backgroundColor = "#fff";
        document.getElementById("seConnBtnId").style.transitionDelay = "0s";
        document.getElementById("seConnBtnId").style.animation = "none";
        //Button Ripple
        document.getElementById("rippleEffectId").style.backgroundColor = "#fff";
        document.getElementById("rippleEffectId").style.transition = "background 0.8s";
        //Button Text
        document.getElementById("seConnTextId").style.display = "block";
        document.getElementById("seConnTextId").style.opacity = "1";
        document.getElementById("seConnTextId").style.transition = "all .3s linear";
        document.getElementById("seConnTextId").style.transitionDelay = "0s"; 
    }

    btnAnim_2_on(){
        //Button
        document.getElementById("regBtnId").style.width = "40px";
        document.getElementById("regBtnId").style.borderBottom = "none";
        document.getElementById("regBtnId").style.backgroundColor = "transparent";
        document.getElementById("regBtnId").style.transitionDelay = ".2s";
        setTimeout(() => {
            document.getElementById("regBtnId").style.animation = "spin .5s linear infinite";    
        }, 450);        
        document.getElementById("regBtnId").style.opacity = "1";

        //Button Ripple
        document.getElementById("rippleEffectId2").style.backgroundColor = "transparent";
        //Button Text
        setTimeout(() => {
            document.getElementById("regTextId").style.opacity = "0";
        }, 300);
    }

    btnAnim_2_Off(){
        //Button
        document.getElementById("regBtnId").style.width = "100%";
        document.getElementById("regBtnId").style.borderBottom = "1px solid #fff";
        document.getElementById("regBtnId").style.backgroundColor = "#fff";
        document.getElementById("regBtnId").style.transitionDelay = "0s";
        document.getElementById("regBtnId").style.animation = "none";
        //Button Ripple
        document.getElementById("rippleEffectId2").style.backgroundColor = "#fff";
        document.getElementById("rippleEffectId2").style.transition = "background 0.8s";
        //Button Text
        document.getElementById("regTextId").style.display = "block";
        document.getElementById("regTextId").style.opacity = "1";
        document.getElementById("regTextId").style.transition = "all .3s linear";
        document.getElementById("regTextId").style.transitionDelay = "0s"; 
    }

}
