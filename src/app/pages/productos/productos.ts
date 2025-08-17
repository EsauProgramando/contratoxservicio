import {Component, signal} from '@angular/core';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {TagModule} from 'primeng/tag';
import {ProgressBarModule} from 'primeng/progressbar';
import {ProductosService} from '../../services/productos-service';
import {FormsModule} from '@angular/forms';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {ListaProductosModel, ListatipoProductosModel, ProductosModel} from '../../model/productosModel';
import {SelectModule} from 'primeng/select';
import {RatingModule} from 'primeng/rating';
import {FieldsetModule} from 'primeng/fieldset';
import {AvatarModule} from 'primeng/avatar';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ImageModule} from 'primeng/image';
import {FloatLabelModule} from 'primeng/floatlabel';
import {FileUploadEvent, FileUploadModule} from 'primeng/fileupload';
import {CommonModule} from '@angular/common';
import {InputNumber} from 'primeng/inputnumber';
import {environment} from '../../environments/environment';
import {CargaComponent} from '../../components/carga/carga.component';

@Component({
  selector: 'app-productos',
  imports: [TableModule, ButtonModule, TagModule, ProgressBarModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule,
    MultiSelectModule, SelectModule, RatingModule, FieldsetModule, AvatarModule, DialogModule, ConfirmDialogModule, ImageModule,
    FloatLabelModule, FileUploadModule, CommonModule, InputNumber,CargaComponent],
  templateUrl: './productos.html',
  standalone: true,
  styleUrl: './productos.scss'
})
export class Productos {
  loading:boolean=false
  listaProductos = signal<ListaProductosModel[]>([]);
  listatipoProductos = signal<ListatipoProductosModel[]>([]);
  searchValue:any
  op:number=0
  productDialog:boolean=false
  value = signal('');
  product = signal<ListaProductosModel | null>(null);
  value3:any
  carga:boolean=false
  spinner:boolean=false
  subirProducto = signal<ProductosModel>(new ProductosModel());
  listaestados:any=[{
    descripcion:"ACTIVO",
    severity:"success"
  },{
    descripcion:"DESACTIVADO",
    severity:"danger"
  }]
  environment = environment;
  constructor(private productosService:ProductosService,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,) {
  }

  ngOnInit(){
    console.log("carga inicial")
    this.cargarlista()
    this.productosService.gettipoProductos().subscribe({
      next:(data)=>{
        this.listatipoProductos.set(data.data)
      }
    })
  }
  cargarlista(){
    this.spinner=true
    this.productosService.getProductos().subscribe({
      next:(data)=>{
        this.listaProductos.set(data.data)
        this.spinner=false
      },error:(err)=>{
        this.spinner=false
      }
    })
  }
  openNew() {
    this.subirProducto.set(new ProductosModel());
    this.productDialog = true;
  }

  editProduct(product: ProductosModel) {
    this.subirProducto.set(product);
    // this.subirProducto.update(current => ({
    //   ...current,
    //   id_productos: product.id_productos,
    //   id_tipoprod:product.id_tipoprod,
    //   descripcion:product.descripcion,
    //   descactual:product.desc
    // }));
    this.productDialog = true;
  }

  deleteProduct(product: ListaProductosModel) {
    this.confirmationService.confirm({
      message: 'Está seguro de desactivar el producto: ' + product.descripcion + '?',
      header: 'Alerta de Desactivación',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'No',
        severity: 'secondary',
        variant: 'text'
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Si, Eliminar',
        icon:'pi pi-check'
      },
      accept: () => {
        this.listaProductos.set(this.listaProductos().filter((val) => val.id_productos !== product.id_productos));
        this.product.set(null);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  onBasicUploadAuto(event: FileUploadEvent) {
    this.carga = false;

    const file: File = event.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const base64: string = reader.result as string;
      // this.subirBaja.archivobase64=base64
      this.subirProducto.update(p => ({ ...p, archivobase64: base64 }));
      this.messageService.add({
        severity: 'info',
        summary: 'Success',
        detail: 'Archivo en Espera para GUARDAR'
      });

      const mime = file.type; // Ej: "application/pdf"
      const extension = mime.split('/')[1]; // Ej: "pdf"
      console.log(extension,'ext')
      // this.subirBaja.extensiondoc=extension
      this.subirProducto.update(p => ({ ...p, extensiondoc: extension }));
    };

    reader.onerror = (err) => {
      console.error('Error al leer el archivo:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo convertir el archivo'
      });
    };

    reader.readAsDataURL(file);
  }
  saveProducto(){
    this.op=1
    this.productDialog=false
    this.spinner=true
    console.log(this.subirProducto())
    this.productosService.registrarProductos(this.subirProducto(),this.op).subscribe({
      next:(data)=>{
        this.cargarlista()
        this.spinner=false
      },error:(err)=>{
        this.productDialog=true
        this.spinner=false
      }
    })
  }
}
