export class ordentrabajoModel {
  idordentrabajo: string='';
  fechareg:       string='';
  fechaorden:     string='';
  creador:        string='';
  estado:         string='';
  motivo:         string='';
  id_tecnico:     string='';
  tecnico:        string='';
  id_cliente:     number=0;
  id_tipo:        number=0;
  nombre_completo:string='';
  servicio:string='';
  direccion:string='';
  tipo:string='';
  path_imagen:string='';
  observacion:string='';
}
export class requestOrden {
  id_tecnico:     string='';
  estado:string='';
  fechainicial:string='';
  fechafinal:string='';
}

export class ordentrabajofiltroModel {
  fechainicial:       string='';
  fechafinal:     string='';
  estado:         string='ALL';
  idtecnico:     string='ALL';
}

export class ejecucionordentrabajoModel {
  estado:         string='ALL';
  idtecnico:      string='ALL';
  idordentrabajo: string='';
  observaciones:  string='';
  latitud:  number=0;
  longitud:  number=0;
  potenciaopt:    number=0;
  rssi:    number=0;
  snr:    number=0;
  descmbps:    number=0;
  subbps:    number=0;
  ping:    number=0;
  pinggateway:     boolean=false;
  navegacionweb:    boolean=false;
  speedtest:    boolean=false;
  iptv:    boolean=false;
  voip:    boolean=false;
  img_evidencia:      string='ALL';
  materiales:materialesModel[]=[]
}
export class materialesModel {
  idtipo:number=1
  tipo:string=''
  marca: string='';
  serie: string='';
  cantidad:    number=0;
  nota: string='';
}
export class tipomaterialModel {
  idtipomaterial:number=0
  destipo:string=''
}
export class HistorialordentrabajoModel {
  archivobase64:string=''
  extensiondoc:string=''
  descripcion:string=''
}
