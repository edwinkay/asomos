import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activate-musica',
  templateUrl: './activate-musica.component.html',
  styleUrls: ['./activate-musica.component.scss'],
})
export class ActivateMusicaComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
