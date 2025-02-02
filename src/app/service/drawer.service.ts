import { ComponentType } from '@angular/cdk/portal';
import { Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawerToggle = new Subject<{ open: boolean; component?: ComponentType<any>; data?: any }>();
  drawerToggle$ = this.drawerToggle.asObservable();

  /**
   * Opens the drawer with the specified component and optional data.
   * Emits a value through the drawerToggle subject to trigger the drawer open state.
   *
   * @param component - The component to be rendered inside the drawer.
   * @param data - Optional data to be passed to the component.
   */

  open(component: Type<any>, data?: any) {
    this.drawerToggle.next({ open: true, component, data });
  }

  /**
   * Closes the drawer and emits a value through the drawerToggle subject to trigger the drawer close state.
   */
  close() {
    this.drawerToggle.next({ open: false });
  }
}
