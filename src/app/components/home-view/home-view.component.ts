import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from "@angular/material/grid-list";

@Component({
    selector: 'app-home-view',
    imports: [MatIconModule, MatGridListModule],
    templateUrl: './home-view.component.html',
    styleUrl: './home-view.component.scss',
    standalone: true
})
export class HomeViewComponent {

}
