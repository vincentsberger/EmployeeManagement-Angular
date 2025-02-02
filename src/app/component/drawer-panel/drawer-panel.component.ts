import {
  Component,
  OnDestroy,
  ViewChild,
  Type,
  Injectable,
  ViewContainerRef,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../service/drawer.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drawer-panel',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('500ms 100ms ease-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('500ms 100ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
  styleUrl: './drawer-panel.component.scss',
  templateUrl: './drawer-panel.component.html',
})
@Injectable({
  providedIn: 'root',
})
export class DrawerPanelComponent implements OnDestroy, AfterViewInit {
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: false })
  container!: ViewContainerRef;

  title = 'test';
  isOpen = false;
  private subscription!: Subscription;
  private pendingComponent?: { component: Type<any>; data?: any };

  constructor(protected drawerService: DrawerService) {
    this.subscription = this.drawerService.drawerToggle$.subscribe(
      ({ open, component, data }) => {
        this.title = data?.title;
        this.isOpen = open;
        if (open && component) {
          if (this.container) {
            this.loadComponent(component, data);
          } else {
            this.pendingComponent = { component, data }; // Warte, bis View init ist
          }
        } else {
          this.clearComponent();
        }
      }
    );
  }


  ngAfterViewInit() {
    if (this.pendingComponent) {
      this.loadComponent(
        this.pendingComponent.component,
        this.pendingComponent.data
      );
      this.pendingComponent = undefined;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.clearComponent();
  }

  private loadComponent(component: Type<any>, data?: any) {
    this.clearComponent(); // Vorherige Komponente entfernen
    const componentRef = this.container.createComponent(component);

    if (data) {
      Object.assign(componentRef.instance, data);
    }
  }

  private clearComponent() {
    this.container?.clear();
  }

  close() {
    this.drawerService.close(); // Schließen über Service, um Konsistenz zu wahren
  }
}
