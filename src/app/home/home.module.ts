import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ShipCardListComponent } from './icon-ui/ship-card-list/ship-card-list.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { ShipCardComponent } from './icon-ui/ship-card-list/ship-card/ship-card.component';
import { CategoryEditorComponent } from '../prompts/category-editor/category-editor.component';
import { SortListComponent } from './sort-list/sort-list.component';
import { ShipLevelEditorComponent } from '../prompts/ship-level-editor/ship-level-editor.component';
import { IconUIComponent } from './icon-ui/icon-ui.component';
import { SheetUIComponent } from './sheet-ui/sheet-ui.component';
import { SettingsComponent } from '../prompts/settings/settings.component';
import { SheetShipRowComponent } from './sheet-ui/sheet-category/sheet-ship-row/sheet-ship-row.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { HelperComponent } from '../prompts/helper/helper.component';
import { SettingsToggleComponent } from '../prompts/settings/settings-toggle/settings-toggle.component';
import { SheetCategoryComponent } from './sheet-ui/sheet-category/sheet-category.component';
import { FilterService } from '../services/filter.service';
import { FilterButtonComponent } from './filter-list/filter-button/filter-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  declarations: [
    HomePage, 
    ShipCardListComponent, 
    FilterListComponent, 
    ShipCardComponent, 
    CategoryEditorComponent, 
    SortListComponent, 
    ShipLevelEditorComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SettingsComponent,
    SheetShipRowComponent,
    HelpButtonComponent,
    HelperComponent,
    SettingsToggleComponent,
    SheetCategoryComponent,
    FilterButtonComponent
  ],
  exports: [
    ShipCardListComponent, 
    ShipCardComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SettingsComponent,
    SheetShipRowComponent,
    CategoryEditorComponent,
    HelpButtonComponent,
    HelperComponent,
    SettingsToggleComponent
  ],
  providers: [CategoryEditorComponent, IconUIComponent]
})
export class HomePageModule {}
