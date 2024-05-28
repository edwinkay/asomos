import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor(private menu: MenuController, private router: Router) {}

  ngOnInit(): void {
    this.menu.close();
  }

  tabChanged(tabName: string) {
    if (tabName === 'tab1') {
    }
    else if (tabName === 'tab2') {
    } else {
    }
  }
  // tabChanged(tabName: string) {
  //   this.router.navigateByUrl(`/tabs/${tabName}`);
  // }

  openMenu() {
    this.menu.open();
  }

  closeMenu() {
    this.menu.close();
  }
}
