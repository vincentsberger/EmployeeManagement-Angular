import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from "@angular/material/grid-list";
import { MainViewComponent } from "../main-view/main-view.component";

@Component({
    selector: 'app-home-view',
    imports: [MatIconModule, MatGridListModule, MainViewComponent],
    templateUrl: './home-view.component.html',
    styleUrl: './home-view.component.scss',
    standalone: true,
})
export class HomeViewComponent {

}
