import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {Upload} from '../../model/upload';
import {SliderModule} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-firma-elec',
  imports: [SliderModule,FormsModule,CommonModule,ButtonModule],
  templateUrl: './firma-elec.html',
  standalone: true,
  styleUrl: './firma-elec.scss'
})
export class FirmaElec {
  @ViewChild("canvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  // @Input() tiporecepcion: string='';
  // @Input() nombre_cliente: string='';
  // @Input() dni: string='';

  @Output() uploadEmitir = new EventEmitter<Upload[]>();

  private cx!: CanvasRenderingContext2D;
  private points: Array<any> = [];
  public width = 400;
  public height = 230;
  color: any = "#000";
  slider: number = 3;
  relleno: boolean = false;

  private prevMouseX!: number;
  private prevMouseY!: number;
  private snapshot!: ImageData;
  private isDrawing = false;
  selectedTool = "brush";
  _upload: Upload[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.disableZoom();
  }

  ngOnDestroy(): void {
    this.enableZoom();
  }

  ngAfterViewInit() {
    this.render();
  }

  selectTool(toolId: string) {
    this.selectedTool = toolId;
  }

  private render() {
    const canvasEl = this.canvas.nativeElement;
    const context = canvasEl.getContext("2d");

    if (context) {
      this.cx = context;
      canvasEl.width = this.width;
      canvasEl.height = this.height;

      this.cx.lineWidth = 3;
      this.cx.lineCap = "round";
      this.cx.strokeStyle = "#000";
      this.cx.fillStyle = "transparent";
      this.setCanvasBackground();
    } else {
      console.error("No se pudo obtener el contexto 2D del canvas.");
    }
  }

  setCanvasBackground() {
    if (!this.cx) {
      return;
    }
    this.cx.fillStyle = "transparent";
    this.cx.fillRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.cx.fillStyle = this.color;
  }

  clearCanvas() {
    if (!this.cx) {
      console.error("El contexto del canvas no está inicializado.");
      return;
    }
    this.cx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
  }

  saveImage(): Upload[] {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.canvas.nativeElement.width;
    tempCanvas.height = this.canvas.nativeElement.height;
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      tempCtx.fillStyle = "transparent";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(this.canvas.nativeElement, 0, 0);

      // Obtener datos del canvas para verificar si hay dibujo
      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      ).data;
      let hasDrawing = false;

      // Se recorre cada píxel en bloques de 4 (RGBA)
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Verificamos si el píxel no es completamente transparente y difiere de un fondo blanco
        if (a !== 0 && (r !== 255 || g !== 255 || b !== 255)) {
          hasDrawing = true;
          break;
        }
      }

      // Si no hay dibujo, se emite un array vacío
      if (!hasDrawing) {
        console.warn("No se detectó escritura en el canvas.");
        this._upload = []; // Aseguramos que _upload esté vacío
        this.uploadEmitir.emit(this._upload);
        return this._upload;
      }

      // Si se detectó dibujo, se crea el objeto Upload y se añade a _upload
      const imageDataURL = tempCanvas.toDataURL("image/png");

      let upd = new Upload();
      upd.imgbase64 = imageDataURL;
      upd.observacion = "";
      // upd.tiporecepcion = this.tiporecepcion;
      upd.tipoarchivo = "IMG";

      this._upload.push(upd);
      this.uploadEmitir.emit(this._upload);
      return this._upload;
    }

    // Si no se pudo obtener el contexto, se emite y retorna un array vacío
    this._upload = [];
    this.uploadEmitir.emit(this._upload);
    return this._upload;
  }

  startDraw(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    let clientX: number;
    let clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.offsetX;
      clientY = e.offsetY;
    } else if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      clientX = touch.clientX - rect.left;
      clientY = touch.clientY - rect.top;
    } else {
      return;
    }

    this.prevMouseX = clientX;
    this.prevMouseY = clientY;

    if (this.cx) {
      this.cx.beginPath();
      this.cx.lineWidth = this.slider;
      this.cx.strokeStyle = this.color;
      this.cx.fillStyle = this.color;
      this.snapshot = this.cx.getImageData(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
    }
  }

  drawing(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing || !this.cx) return;
    this.cx.putImageData(this.snapshot, 0, 0);

    let clientX: number;
    let clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.offsetX;
      clientY = e.offsetY;
    } else if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      clientX = touch.clientX - rect.left;
      clientY = touch.clientY - rect.top;
    } else {
      return;
    }

    if (this.selectedTool === "brush" || this.selectedTool === "eraser") {
      this.cx.strokeStyle =
        this.selectedTool === "eraser" ? "#fff" : this.color;
      this.cx.lineTo(clientX, clientY);
      this.cx.stroke();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  disableZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }
  }

  enableZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes"
      );
    }
  }
}
