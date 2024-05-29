import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent  implements OnInit {
  mn = true
  im = false
  vd = false

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
  main(){
    this.mn = true;
    this.im = false;
    this.vd = false;
  }
  images(){
    this.mn = false;
    this.im = true;
    this.vd = false;
  }
  videos(){
    this.mn = false;
    this.im = false;
    this.vd = true;
  }

}
