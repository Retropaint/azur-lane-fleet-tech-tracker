import { Component, Input, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { MiscService } from 'src/app/services/misc.service';
import { ShortenedNamesService } from 'src/app/services/shortened-names.service';

@Component({
  selector: 'app-faction-tech-box',
  templateUrl: './faction-tech-box.component.html',
  styleUrls: ['./faction-tech-box.component.scss'],
})
export class FactionTechBoxComponent implements OnInit {

  @Input() fullFactionName: string;
  @Input() level: number

  constructor(
    public shortenedNames: ShortenedNamesService,
    public misc: MiscService
  ) { }

  async ngOnInit() {}

}
