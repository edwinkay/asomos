import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss'],
})
export class ActivateComponent  implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }

}
