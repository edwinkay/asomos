import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-asomos-main',
  templateUrl: './asomos-main.component.html',
  styleUrls: ['./asomos-main.component.scss'],
})
export class AsomosMainComponent implements OnInit {
  mn = true;
  im = false;
  vd = false;
  ms = false;

  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

  main() {
    this.mn = true;
    this.im = false;
    this.vd = false;
    this.ms = false;
  }

  images() {
    this.mn = false;
    this.im = true;
    this.vd = false;
    this.ms = false;
  }

  videos() {
    this.mn = false;
    this.im = false;
    this.vd = true;
    this.ms = false;
  }

  musica() {
    this.mn = false;
    this.im = false;
    this.vd = false;
    this.ms = true;
  }
}
