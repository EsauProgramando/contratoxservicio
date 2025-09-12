import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [
    ButtonModule,
    PanelModule,
    AvatarModule,
    MenuModule,
    AvatarModule,
    InputTextModule,
    RouterModule,
  ],
  templateUrl: './home.html',
  standalone: true,
  styleUrl: './home.scss',
})
export class Home {
  items: { label?: string; icon?: string; separator?: boolean }[] = [];
  ngOnInit() {
    this.items = [
      {
        label: 'Refresh',
        icon: 'pi pi-refresh',
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
      },
      {
        separator: true,
      },
      {
        label: 'Delete',
        icon: 'pi pi-times',
      },
    ];
  }
}
