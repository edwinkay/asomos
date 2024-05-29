import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-activate-video',
  templateUrl: './activate-video.component.html',
  styleUrls: ['./activate-video.component.scss'],
})
export class ActivateVideoComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
