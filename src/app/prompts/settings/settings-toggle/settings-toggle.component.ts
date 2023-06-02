import { Component, Input, OnInit } from '@angular/core';
import { SettingsDataService } from 'src/app/services/settings-data.service';

@Component({
  selector: 'app-settings-toggle',
  templateUrl: './settings-toggle.component.html',
  styleUrls: ['./settings-toggle.component.scss'],
})
export class SettingsToggleComponent implements OnInit {

  @Input() name: string;
  @Input() storageName: string;
  @Input() defaultState: string;
  @Input() toggles: string[];

  currentToggle: string;

  constructor(private settingsData: SettingsDataService) {}

  async ngOnInit() {
    const storageToggle = this.settingsData.settings[this.storageName];
    if(storageToggle != null) {
      this.currentToggle = storageToggle;
    } else {
      this.currentToggle = this.defaultState;
    }
  }

  setToggle(toggle: string) {
    this.currentToggle = toggle;
    this.settingsData.initialSettings[this.storageName] = toggle;
  }
}
