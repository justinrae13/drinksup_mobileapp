import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabsproprio',
  templateUrl: './tabsproprio.page.html',
  styleUrls: ['./tabsproprio.page.scss'],
})
export class TabsproprioPage implements OnInit {
  c_o_o_t_z : string = "1";
  c_d_o_t_z : string = "flex";

  constructor() { }

  ngOnInit() {
  }

  ionViewDidEnter(){    
    this.c_o_o_t_z = "0";
    setTimeout(() => {
      this.c_d_o_t_z = "none";
    }, 500);
  }

}
