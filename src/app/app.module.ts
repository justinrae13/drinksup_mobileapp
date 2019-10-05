import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule} from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx'
import { UsersPageModule } from '../pages/users/users.module';
import { ModalPageModule } from '../pages/modal/modal.module';
import { Camera } from '@ionic-native/camera/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ModalbarAdminPageModule } from '../pages/modalbar-admin/modalbar-admin.module';
import { ModalSchedulePageModule } from '../pages/modal-schedule/modal-schedule.module';
import { LoadingpagePageModule } from '../pages/loadingpage/loadingpage.module';
import { ModalQrcodePageModule } from '../pages/modal-qrcode/modal-qrcode.module';
import { OffersAddbarPageModule } from '../pages/offers-addbar/offers-addbar.module';
import { ModalRatingsPageModule } from '../pages/modal-ratings/modal-ratings.module';
import { ModalChangePhotosPageModule } from '../pages/modal-change-photos/modal-change-photos.module';
import { ModalChangeUserphotoPageModule } from '../pages/modal-change-userphoto/modal-change-userphoto.module';
import { ModalMoreOptionPageModule } from '../pages/modal-more-option/modal-more-option.module';
import { ModalToSponsorPageModule } from '../pages/modal-to-sponsor/modal-to-sponsor.module';
import { ModalToSharePageModule } from '../pages/modal-to-share/modal-to-share.module';
import { ModalGetSponsoredPageModule } from '../pages/modal-get-sponsored/modal-get-sponsored.module';
import { ModalStatsDetailsPageModule } from '../pages/modal-stats-details/modal-stats-details.module';
import { AbonnementPageModule } from '../pages/abonnement/abonnement.module';

import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { PayPal } from '@ionic-native/paypal/ngx';

import { Calendar } from '@ionic-native/calendar/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Network } from '@ionic-native/network/ngx';
import { mdTransitionAnimation } from '@ionic/core/dist/collection/utils/transition/md.transition';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [NgxQRCodeModule, BrowserModule, IonicModule.forRoot({navAnimation:mdTransitionAnimation}), AppRoutingModule, HttpClientModule, AbonnementPageModule, UsersPageModule, ModalStatsDetailsPageModule, ModalGetSponsoredPageModule, ModalToSharePageModule, ModalToSponsorPageModule, ModalChangePhotosPageModule, ModalChangeUserphotoPageModule, ModalPageModule, ModalQrcodePageModule, ModalbarAdminPageModule, ModalSchedulePageModule, LoadingpagePageModule, OffersAddbarPageModule, ModalRatingsPageModule, ModalMoreOptionPageModule, IonicStorageModule.forRoot()],
    providers: [
        PayPal,
        StatusBar,
        SplashScreen,
        GooglePlus,
        Facebook,
        Camera,
        Deeplinks,
        Calendar,
        EmailComposer,
        Stripe,
        BarcodeScanner,
        LaunchNavigator,
        Geolocation,
        NativeGeocoder,
        SocialSharing,
        Clipboard,
        Device,
        Network,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
