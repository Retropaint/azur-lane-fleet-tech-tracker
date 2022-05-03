import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptButtonComponent } from './prompt-button/prompt-button.component';
import { SettingsComponent } from '../prompts/settings/settings.component';
import { ToggleFlagComponent } from './toggle-flag/toggle-flag.component';
import { PromptHeaderComponent } from '../prompts/Components/prompt-header/prompt-header.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from '../home/home-routing.module';
import { SettingsToggleComponent } from '../prompts/settings/settings-toggle/settings-toggle.component';
import { HullInfoPanelComponent } from '../home/hull-info-panel/hull-info-panel.component';
import { HullInfoExceptionComponent } from '../home/hull-info-panel/hull-info-exception/hull-info-exception.component';
import { HullIconComponent } from '../shared//hull-icon/hull-icon.component';
import { FeaturePanelComponent } from '../shared/feature-panel/feature-panel.component';
import { SortListComponent } from '../shared/feature-panel/sort-list/sort-list.component';
import { FilterListComponent } from '../shared/feature-panel/filter-list/filter-list.component';
import { FilterButtonComponent } from '../shared/feature-panel/filter-list/filter-button/filter-button.component';
import { GenericBigButtonComponent } from './generic-big-button/generic-big-button.component';

@NgModule({
  declarations: [
    PromptButtonComponent,
    SettingsComponent,
    ToggleFlagComponent,
    PromptHeaderComponent,
    SettingsToggleComponent,
    HullInfoPanelComponent,
    HullInfoExceptionComponent,
    HullIconComponent,
    FeaturePanelComponent,
    SortListComponent,
    FilterListComponent,
    FilterButtonComponent,
    GenericBigButtonComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PromptButtonComponent,
    SettingsComponent,
    SettingsToggleComponent,
    ToggleFlagComponent,
    PromptHeaderComponent,
    HullInfoPanelComponent,
    HullInfoExceptionComponent,
    HullIconComponent,
    FeaturePanelComponent,
    SortListComponent,
    FilterListComponent,
    FilterButtonComponent,
    FeaturePanelComponent,
    GenericBigButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ]
})
export class SharedModule { }
