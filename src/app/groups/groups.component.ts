import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent  implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {}

  navegarActivate(){
    this.router.navigate(['/activate'])
  }

}
