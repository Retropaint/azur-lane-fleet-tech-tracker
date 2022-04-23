import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ShipCardListComponent } from './icon-ui/ship-card-list/ship-card-list.component';
import { FilterListComponent } from './feature-panel/filter-list/filter-list.component';
import { ShipCardComponent } from './icon-ui/ship-card-list/ship-card/ship-card.component';
import { SortListComponent } from './feature-panel/sort-list/sort-list.component';
import { ShipLevelEditorComponent } from '../prompts/ship-level-editor/ship-level-editor.component';
import { IconUIComponent } from './icon-ui/icon-ui.component';
import { SheetUIComponent } from './sheet-ui/sheet-ui.component';
import { SheetShipRowComponent } from './sheet-ui/sheet-category/sheet-ship-row/sheet-ship-row.component';
import { SheetCategoryComponent } from './sheet-ui/sheet-category/sheet-category.component';
import { FilterButtonComponent } from './feature-panel/filter-list/filter-button/filter-button.component';
import { ConfirmationComponent } from '../prompts/confirmation/confirmation.component';
import { GenericBigButtonComponent } from './Components/generic-big-button/generic-big-button.component';
import { CreditsComponent } from '../prompts/credits/credits.component';
import { FeaturePanelComponent } from './feature-panel/feature-panel.component';
import { TechSummaryComponent } from './tech-summary/tech-summary.component';
import { FactionTechBoxComponent } from './tech-summary/faction-tech-box/faction-tech-box.component';
import { FactionTechLevelEditorComponent } from '../prompts/faction-tech-level-editor/faction-tech-level-editor.component';
import { TechHullStatDisplayComponent } from './tech-summary/tech-hull-stat-display/tech-hull-stat-display.component';
import { MobileWarningComponent } from '../prompts/mobile-warning/mobile-warning.component';
import { SharedModule } from '../shared/shared.module';
import { MiscService } from '../services/misc.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [
    HomePage, 
    ShipCardListComponent, 
    FilterListComponent, 
    ShipCardComponent, 
    SortListComponent, 
    ShipLevelEditorComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SheetShipRowComponent,
    SheetCategoryComponent,
    FilterButtonComponent,
    ConfirmationComponent,
    GenericBigButtonComponent,
    CreditsComponent,
    FeaturePanelComponent,
    TechSummaryComponent,
    FactionTechBoxComponent,
    FactionTechLevelEditorComponent,
    TechHullStatDisplayComponent,
    MobileWarningComponent,
  ],
  exports: [
    ShipCardListComponent, 
    ShipCardComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SheetShipRowComponent,
    ConfirmationComponent,
    CreditsComponent,
    SheetCategoryComponent,
  ],
  providers: [
    IconUIComponent, 
    ConfirmationComponent,
    SheetCategoryComponent,
  ]
})
export class HomePageModule {}
