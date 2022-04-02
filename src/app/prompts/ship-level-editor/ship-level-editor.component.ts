import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { Ship } from 'src/app/interfaces/ship';
import { FilterService } from 'src/app/services/filter.service';
import { IconLoaderService } from 'src/app/services/icon-loader.service';
import { PromptService } from 'src/app/services/prompt.service';
import { ShipsService } from 'src/app/services/ships.service';

@Component({
  selector: 'app-ship-level-editor',
  templateUrl: './ship-level-editor.component.html',
  styleUrls: ['./ship-level-editor.component.scss', 'level-slider.scss'],
})
export class ShipLevelEditorComponent implements OnInit, AfterViewInit {

  @Input() name: string;
  @Input() level: number;
  @Input() isIgnored: boolean;
  @Input() ship: Ship;
  @Input() category: string;
  @ViewChild('autoResize') autoResize: ElementRef;
  textLevel: number;
  wasSlider: boolean;

  @ViewChild('input') input: ElementRef;

  constructor(
    private prompt: PromptService, 
    private modalController: ModalController, 
    private shipsService: ShipsService, 
    private iconLoader: IconLoaderService,
    private filter: FilterService) { }

  ngOnInit() {
    this.textLevel = this.level;
  }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    this.prompt.init(this.autoResize.nativeElement.getBoundingClientRect().height, true);
  }

  exit() {
    this.modalController.dismiss();
  }

  done() {
    const newShipInfo = {
      "level": Math.min(this.level, 125),
      "isIgnored": this.isIgnored || false
    }
    if(!this.wasSlider) {
      newShipInfo.level = Math.min(this.textLevel, 125)
    }
    this.modalController.dismiss(newShipInfo);
  }

  // change which input type will be accepted in the end, as text and slider levels are inputted separately
  // they're different to prevent slider from following text input, as it looks awkward
  changeLastInput(wasSlider: boolean) {
    this.wasSlider = wasSlider;
    if(!wasSlider) {
      this.textLevel = this.input.nativeElement.value;
    }
  }

  updateSlider() {
    this.level = this.textLevel;
  }

  choseMarker(markerLevel: number) {
    this.wasSlider = true;
    this.level = markerLevel;
    this.done();
  }

  setIgnored(toggle) {
    this.isIgnored = toggle;
  }

  ngOnDestroy() {
    this.prompt.exit();
  }
}
