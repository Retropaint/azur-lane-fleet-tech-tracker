import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FactionTechDataService } from 'src/app/services/faction-tech-data.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShortenedNamesService } from 'src/app/services/shortened-names.service';

@Component({
  selector: 'app-faction-tech-level-editor',
  templateUrl: './faction-tech-level-editor.component.html',
  styleUrls: ['./faction-tech-level-editor.component.scss', '../../../level-slider.scss'],
})
export class FactionTechLevelEditorComponent implements OnInit, AfterViewInit {

  @ViewChild('input') input: ElementRef;
  @ViewChild('autoResize') autoResize: ElementRef;
  @Input() fullFactionName: string;
  maxLevel: number = 1;
  sliderLevel: number;
  textLevel: number;
  wasSlider: boolean = true;

  constructor(private modalController: ModalController, 
    private prompt: PromptService, 
    private factionTechData: FactionTechDataService,
    private storage: Storage) { }

  async ngOnInit() {
    // get max level of faction
    switch(this.fullFactionName) {
      case "Eagle Union":
        this.sliderLevel = await this.storage.get("USS") || 1;
        while(this.factionTechData.USS[this.maxLevel] != null) {
          this.maxLevel++;
        }
      break; case "Royal Navy":
        this.sliderLevel = await this.storage.get("HMS") || 1;
        while(this.factionTechData.HMS[this.maxLevel] != null) {
          this.maxLevel++;
        }
      break; case "Sakura Empire":
        this.sliderLevel = await this.storage.get("IJN") || 1;
        while(this.factionTechData.IJN[this.maxLevel] != null) {
          this.maxLevel++;
        }
      break; case "Iron Blood":
        this.sliderLevel = await this.storage.get("KMS") || 1;
        while(this.factionTechData.KMS[this.maxLevel] != null) {
          this.maxLevel++;
        }
      break;
    }

    // maxLevel turns out 1 level higher, deduct
    this.maxLevel--;
  }

  ngAfterViewInit() {
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  // change which input field was chosen, so it will be chosen last in done()
  changeLastInput(wasSlider: boolean) {
    this.wasSlider = wasSlider;
    if(!wasSlider) {
      this.textLevel = this.input.nativeElement.value;
    }
  }

  updateSlider() {
    this.sliderLevel = this.textLevel;
  }

  done() {
    if(this.wasSlider) {
      this.modalController.dismiss(this.sliderLevel);
    } else {
      this.modalController.dismiss(this.textLevel)
    }
  }

  exit() {
    this.modalController.dismiss();
  }

  choseMarker(level: number) {
    this.wasSlider = true;
    this.sliderLevel = level;
    this.done();
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
