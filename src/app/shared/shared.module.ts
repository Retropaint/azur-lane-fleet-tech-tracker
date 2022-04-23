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
import { HullIconComponent } from '../home/Components/hull-icon/hull-icon.component';

@NgModule({
  declarations: [
    PromptButtonComponent,
    SettingsComponent,
    ToggleFlagComponent,
    PromptHeaderComponent,
    SettingsToggleComponent,
    HullInfoPanelComponent,
    HullInfoExceptionComponent,
    HullIconComponent
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
    HullIconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ]
})
export class SharedModule { }
