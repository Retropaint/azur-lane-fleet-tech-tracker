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

  constructor(
    private modalController: ModalController, 
    private prompt: PromptService, 
    private factionTechData: FactionTechDataService,
    private storage: Storage,
    private shortenedNamesService: ShortenedNamesService  
  ) { }

  async ngOnInit() {
    const shortenedName = this.shortenedNamesService.factions[this.fullFactionName]
    this.maxLevel = this.factionTechData.maxLevels[shortenedName];
    this.sliderLevel = await this.storage.get(shortenedName) || 0;

    setTimeout(() => {
      this.input.nativeElement.focus()
    }, 250)
  }

  ngAfterViewInit() {
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  // change which input field was chosen, so it will be chosen last in done()
  changeLastInput(wasSlider: boolean) {
    this.wasSlider = wasSlider;
    if(!wasSlider) {
      this.textLevel = this.input.nativeElement.value;
    } else {
      this.textLevel = this.sliderLevel;
    }
  }

  updateSlider() {
    if(this.textLevel != null) {
      this.sliderLevel = this.textLevel;
    }
  }

  done() {
    if(this.wasSlider) {
      this.modalController.dismiss(Math.min(this.sliderLevel, this.maxLevel));
    } else {
      this.modalController.dismiss(Math.min(this.textLevel, this.maxLevel));
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
