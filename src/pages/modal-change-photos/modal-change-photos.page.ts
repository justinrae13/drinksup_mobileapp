import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-modal-change-photos',
  templateUrl: './modal-change-photos.page.html',
  styleUrls: ['./modal-change-photos.page.scss'],
})
export class ModalChangePhotosPage implements OnInit {
  uplPhotoURI = 'https://www.drinksup.ch/serveur/barphotos/';
  barName : string;
  photoNUM : string;


  constructor(private modalCtrl : ModalController, private navParam : NavParams, private toastCtrl : ToastController, private http : HttpClient, private camera : Camera) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.barName = this.navParam.get('bar_name');
  }

  whichPhoto(num : string){
    document.getElementById("pho_"+num+"_wrapper").style.display = "block";
    document.getElementById("pho_choices_wrapper").style.display = "none";
  }

  backToChoices(num : string){
    document.getElementById("pho_"+num+"_wrapper").style.display = "none";
    document.getElementById("pho_choices_wrapper").style.display = "block";
  }

  upl(photoNumber : string){
    this.photoNUM = photoNumber;
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: true,
    }
    
    this.camera.getPicture(options).then((imageData) => {
      let barName = "?ImageName="+this.barName+"_"+this.photoNUM;
      let postData = new FormData();
      let dataObj = {text : "Photo", uploaded : "Yes"};
      postData.append("file",imageData);
      let data:Observable<any> = this.http.post(this.uplPhotoURI+"uploadPhoto.php"+barName, postData);
      this.modalCtrl.dismiss(dataObj);
      data.subscribe((res)=>{
      console.log(res);
      console.log("Upload Successful");
     
      });
    }, (err) => {
      console.log(err);
    });
  }

  gal(photoNumber : string){
    this.photoNUM = photoNumber;
    const options: CameraOptions = {
      quality: 85,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      allowEdit: true,
      correctOrientation: true,
    }
    this.camera.getPicture(options).then((imageData) => { 
      let barName = "?ImageName="+this.barName+"_"+this.photoNUM;
      let postData = new FormData();
      let dataObj = {text : "Photo", uploaded : "Yes"};
      postData.append("file",imageData);
      let data:Observable<any> = this.http.post(this.uplPhotoURI+"uploadPhoto.php"+barName, postData);
      this.modalCtrl.dismiss(dataObj);
      data.subscribe((res)=>{
      console.log(res);
      console.log("Upload Successful");      
      });
    }, (err) => {
      console.log(err);
    });
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }

}
