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
import { Facebook} from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { UsersPageModule } from '../pages/users/users.module';
import { ModalPageModule } from '../pages/modal/modal.module';
import { Camera } from '@ionic-native/camera/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { ModalbarAdminPageModule } from '../pages/modalbar-admin/modalbar-admin.module';
import { ModalSchedulePageModule } from '../pages/modal-schedule/modal-schedule.module';
import { LoadingpagePageModule } from '../pages/loadingpage/loadingpage.module';
import { ModalQrcodePageModule } from '../pages/modal-qrcode/modal-qrcode.module';
import { OffersAddbarPageModule } from '../pages/offers-addbar/offers-addbar.module';
import { Calendar } from '@ionic-native/calendar/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
import {Stripe} from '@ionic-native/stripe/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [NgxQRCodeModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, UsersPageModule, ModalPageModule, ModalQrcodePageModule, ModalbarAdminPageModule, ModalSchedulePageModule, LoadingpagePageModule, OffersAddbarPageModule, IonicStorageModule.forRoot()],
    providers: [
        StatusBar,
        SplashScreen,
        Facebook,
        GooglePlus,
        Camera,
        Deeplinks,
        Calendar,
        EmailComposer,
        Stripe,
        BarcodeScanner,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
