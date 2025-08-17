export class ListaProductosModel {
  id_productos:string|null=null;
  descripcion:string|null=null;
  id_tipoprod:number=0
  tipoprod:string|null=null;


}
export class ProductosModel {
  id_productos:        string|null=null;
  descripcion:         string|null=null;
  impunit:             number=0;
  descactual:          number=0;
  fechareg:            string|null=null;
  estado:              string|null="ACTIVO";
  stock:               number=0;
  id_tipoprod:         number=0;
  tipoprod:            string|null=null;
  fechaupdate:         string|null=null;
  path_imagen:         string|null=null;
  calificacion_actual: number=0;
  archivobase64:       string|null=null;
  documento:           string|null=null;
  extensiondoc:        string|null=null;


}
export class ListatipoProductosModel {
  id_tipoprod:number=0
  descripcion:string|null=null;
}
