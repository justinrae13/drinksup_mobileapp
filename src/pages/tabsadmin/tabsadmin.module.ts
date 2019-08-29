import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsadminPage } from './tabsadmin.page';
// import {OffersManagementPageModule} from '../offers-management/offers-management.module';
import {UsersPageModule} from '../users/users.module';
import {ProfilePageModule} from '../profile/profile.module';

const routes: Routes = [
    {
        path: '',
        component: TabsadminPage,
        children: [
            {
                path: 'users',
                loadChildren: '../users/users.module#UsersPageModule'
            },
            {
                path: 'bar-admin',
                loadChildren: '../bar-admin/bar-admin.module#BarAdminPageModule'
            },
            {
                path: 'offers-admin',
                loadChildren: '../offers-admin/offers-admin.module#OffersAdminPageModule'
            }
        ]
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // OffersManagementPageModule,
    UsersPageModule,
    ProfilePageModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsadminPage]
})
export class TabsadminPageModule {}
