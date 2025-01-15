import { Component } from '@angular/core';
import { RouterOutlet, RouterLink  } from "@angular/router";

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.css'
})
export class MainViewComponent {

}
