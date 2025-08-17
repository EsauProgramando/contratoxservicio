import { Component } from '@angular/core';
import {MenuBar} from '../components/menu-bar/menu-bar';
import {Sidebar} from '../components/sidebar/sidebar';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [MenuBar, Sidebar,AvatarModule,InputTextModule,RouterModule],
  templateUrl: './pages.html',
  standalone: true,
  styleUrl: './pages.scss'
})
export class Pages {

}
