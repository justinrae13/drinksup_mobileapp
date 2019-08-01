import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsproprioPage } from './tabsproprio.page';
import {BarPageModule} from '../bar/bar.module';
import {StatsPageModule} from '../stats/stats.module';
import {QrcodePageModule} from '../qrcode/qrcode.module';
import {ProfilePageModule} from '../profile/profile.module';
import {OffersManagementPageModule} from '../offers-management/offers-management.module';


const routes: Routes = [
    {
        path: '',
        component: TabsproprioPage,
        children: [

            {
                path: 'bar',
                children: [
                    { path: '', loadChildren: '../bar/bar.module#BarPageModule' },
                ]
            },
            {
                path: 'offers-management',
                children: [
                    { path: '', loadChildren: '../offers-management/offers-management.module#OffersManagementPageModule' },
                ]
            },
            {
                path: 'stats',
                children: [
                    { path: '', loadChildren: '../stats/stats.module#StatsPageModule' },
                ]
            },
            {
                path: 'qrcode',
                children: [
                    { path: '', loadChildren: '../qrcode/qrcode.module#QrcodePageModule' },
                ]
            },
            {
                path: 'profile',
                children: [
                    { path: '', loadChildren: '../profile/profile.module#ProfilePageModule' },
                ]
            },
        ]
    },
    {
        path: '',
        redirectTo: '/tabsproprio',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OffersManagementPageModule,
    BarPageModule,
    StatsPageModule,
    QrcodePageModule,
    ProfilePageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsproprioPage]
})
export class TabsproprioPageModule {}
