import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

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

  constructor(private storage: Storage) {}

  async ngOnInit() {
    const storageToggle = await this.storage.get(this.storageName)
    if(storageToggle != null) {
      this.currentToggle = storageToggle;
    } else {
      this.currentToggle = this.defaultState;
    }
  }

  setToggle(toggle: string) {
    this.currentToggle = toggle;
    this.storage.set(this.storageName, toggle);
  }
}
