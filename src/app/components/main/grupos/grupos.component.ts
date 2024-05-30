import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.scss'],
})
export class GruposComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  navegarActivate() {
    this.router.navigate(['/activate']);
  }
}
