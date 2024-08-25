import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent implements OnInit, OnDestroy {
  activate: boolean = false;

  activateVideo: boolean = false;
  private navigationSubscription: Subscription | undefined;

  mn = true;
  im = false;
  vd = false;

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.activate = navigation.extras.state['activate'] || false;
      this.activateVideo = navigation.extras.state['activateVideo'] || false;

      if (this.activate) {
        this.images(); // Si activate es true, abrir la sección de imágenes
      } else {
        this.main(); // Si activate es false, abrir la sección principal
      }
      if (this.activateVideo) {
        this.videos()
      } else {
        this.main();
      }
    }

  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  goBack() {
    this.location.back();
  }

  main() {
    this.mn = true;
    this.im = false;
    this.vd = false;
  }

  images() {
    this.mn = false;
    this.im = true;
    this.vd = false;
  }

  videos() {
    this.mn = false;
    this.im = false;
    this.vd = true;
  }
}
