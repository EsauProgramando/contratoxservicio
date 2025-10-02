import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {PaginatorModule} from 'primeng/paginator';
import {CommonModule} from '@angular/common';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = './assets/pdf.worker.js';

@Component({
  selector: 'app-mostrar-pdf',
  standalone: true,
  imports: [CommonModule,PaginatorModule],
  templateUrl: './mostrar-pdf.html',
  styleUrl: './mostrar-pdf.scss'
})
export class MostrarPdf implements OnChanges{
  @Input() base64pdf: string = '';
  @ViewChild('pdfCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  pdfDoc: any;
  zoom:number=1.5
  totalPages: number = 0;
  currentPage: number = 1;
  private renderTask: any = null;

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['base64pdf'] && this.base64pdf) {
      await this.loadPDF(this.base64pdf);
    }
  }

  async loadPDF(base64: string) {
    let archivobase64 = base64.trim();
    if (archivobase64.startsWith('data:application/pdf;base64,')) {
      archivobase64 = archivobase64.replace('data:application/pdf;base64,', '');
    }

    const byteCharacters = atob(archivobase64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    this.pdfDoc = await (pdfjsLib.getDocument({ data: byteArray }) as any).promise;
    // this.totalPages = this.pdfDoc.numPages;
    this.totalPages = 1;
    this.currentPage = 1;
    await this.renderPage(this.currentPage);
  }

  async renderPage(pageNumber: number) {
    const page = await this.pdfDoc.getPage(pageNumber);

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (this.renderTask) {
      try {
        this.renderTask.cancel();
      } catch (err) {
        console.warn('Cancel render error:', err);
      }
    }

    this.renderTask = page.render({
      canvasContext: context,
      viewport
    });

    await this.renderTask.promise;
  }

  async onPageChange(event: any) {
    this.currentPage = event.page + 1;
    await this.renderPage(this.currentPage);
  }
}
