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
import { SettingsComponent } from '../prompts/settings/settings.component';
import { SheetShipRowComponent } from './sheet-ui/sheet-category/sheet-ship-row/sheet-ship-row.component';
import { SettingsToggleComponent } from '../prompts/settings/settings-toggle/settings-toggle.component';
import { SheetCategoryComponent } from './sheet-ui/sheet-category/sheet-category.component';
import { FilterButtonComponent } from './feature-panel/filter-list/filter-button/filter-button.component';
import { PromptButtonComponent } from '../prompts/Components/prompt-button/prompt-button.component';
import { ConfirmationComponent } from '../prompts/confirmation/confirmation.component';
import { PromptHeaderComponent } from '../prompts/Components/prompt-header/prompt-header.component';
import { GenericBigButtonComponent } from './Components/generic-big-button/generic-big-button.component';
import { ToggleFlagComponent } from '../toggle-flag/toggle-flag.component';
import { CreditsComponent } from '../prompts/credits/credits.component';
import { FeaturePanelComponent } from './feature-panel/feature-panel.component';

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
    SortListComponent, 
    ShipLevelEditorComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SettingsComponent,
    SheetShipRowComponent,
    SettingsToggleComponent,
    SheetCategoryComponent,
    FilterButtonComponent,
    PromptButtonComponent,
    ConfirmationComponent,
    PromptHeaderComponent,
    GenericBigButtonComponent,
    ToggleFlagComponent,
    CreditsComponent,
    FeaturePanelComponent
  ],
  exports: [
    ShipCardListComponent, 
    ShipCardComponent, 
    IconUIComponent, 
    SheetUIComponent,
    SettingsComponent,
    SheetShipRowComponent,
    SettingsToggleComponent,
    PromptButtonComponent,
    ConfirmationComponent,
    PromptHeaderComponent,
    CreditsComponent
  ],
  providers: [
    IconUIComponent, 
    PromptButtonComponent, 
    ConfirmationComponent
  ]
})
export class HomePageModule {}
