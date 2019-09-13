import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Global from '../../app/global';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-modal-change-userphoto',
  templateUrl: './modal-change-userphoto.page.html',
  styleUrls: ['./modal-change-userphoto.page.scss'],
})
export class ModalChangeUserphotoPage{
  user_email : string;
  userPhotoURI = 'https://www.drinksup.ch/serveur/userphotos/';
  baseURI = Global.mainURI;

  constructor(public storage: Storage, private modalCtrl : ModalController, private navParam : NavParams, private http : HttpClient, private camera : Camera) { }

  ionViewWillEnter(){
    this.user_email = this.navParam.get('email');
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

  upl(){
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
    }
    
    this.camera.getPicture(options).then((imageData) => {
      let userEmail = "?UserImgName="+this.user_email+"_photo";
      let postData = new FormData();
      let dataObj = {text : "Photo", uploaded : "Yes"};
      postData.append("file",imageData);
      let data:Observable<any> = this.http.post(this.userPhotoURI+"uploadUserPhoto.php"+userEmail, postData);
      this.modalCtrl.dismiss(dataObj);
      data.subscribe((res)=>{
      console.log(res);
      console.log("Upload Successful");
     
      });
    }, (err) => {
      console.log(err);
    });
  }

  gal(){
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      correctOrientation: true,
    }
    this.camera.getPicture(options).then((imageData) => { 
      let userEmail = "?UserImgName="+this.user_email+"_photo";
      let postData = new FormData();
      let dataObj = {text : "Photo", uploaded : "Yes"};
      postData.append("file",imageData);
      let data:Observable<any> = this.http.post(this.userPhotoURI+"uploadUserPhoto.php"+userEmail, postData);
      this.modalCtrl.dismiss(dataObj);
      data.subscribe((res)=>{
      console.log(res);
      console.log("Upload Successful");      
      });
    }, (err) => {
      console.log(err);
    });
  }

}
