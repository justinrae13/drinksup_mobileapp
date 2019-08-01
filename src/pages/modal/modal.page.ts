import { Component, OnInit } from '@angular/core';
import {ModalController, NavController, NavParams, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as Global from '../../app/global';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  passedId = null;
  passedPrenom = null;
  passedEmail = null;
  passedRoles = null;
  public modifierForm: FormGroup;
  public baseURI = Global.mainURI;
  constructor(private formBuilder: FormBuilder, private route: Router, private navCtrl: NavController, private navParams: NavParams, private modalController: ModalController,  private toastCtrl: ToastController,  public http: HttpClient) {
    this.modifierForm = new FormGroup({
       prenom: new FormControl(),
       email: new FormControl(),
       role: new FormControl(),
       id: new FormControl(),
    });
    this.validationForm();
  }


  validationForm() {
    this.modifierForm = this.formBuilder.group({
       'prenom': ['', Validators.required],
       'email': ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
       'id' : ['', Validators.required],
    });
  }
  ngOnInit() {
    this.passedId = this.navParams.get('id');
    this.passedPrenom = this.navParams.get('prenom');
    this.passedEmail = this.navParams.get('email');
  }
  editUsers() {
    const prenom: string = this.modifierForm.controls['prenom'].value;
    const email: string = this.modifierForm.controls['email'].value;
    const id: number = this.modifierForm.controls['id'].value;
    // update users
    this.updateUsers(prenom, email, id);

  }
  updateUsers(prenom: string, email: string, id: number) {
      const headers: any		= new HttpHeaders({ 'Content-Type': 'application/json' }),
          options: any		= { 'key' : 'updateUser','prenom': prenom, 'email': email, 'id': id},
          url: any      	= this.baseURI;

      this.http.post(url, JSON.stringify(options), headers).subscribe((data: any) => {
              this.sendNotification('Votre modification a bien été pris en compte !');
              this.closeModal();
          },
          (error: any) => {
              console.log(error);
              this.sendNotification('Erreur!');
          });
  }

  async navTabs(msg: string) {
      this.route.navigateByUrl(msg);
  }
  closeModal() {
    this.modalController.dismiss();
    // this.usersPage.ngOnInit();
  }
  async sendNotification(msg: string) {
      const toast = await this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
      });
      toast.present();
  }

}
