import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab2Page } from './tab2.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { GroupsComponentModule } from '../groups/groups.module';
import { NavbarComponentModule } from '../components/navbar/navbar.module';
import { Tab2PageRoutingModule } from './tab2-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab2PageRoutingModule,
    GroupsComponentModule,
    NavbarComponentModule
  ],
  declarations: [Tab2Page],
})
export class Tab2PageModule {}
