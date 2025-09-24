export class ordentrabajoModel {
  idordentrabajo: string='';
  fechareg:       string='';
  fechaorden:     string='';
  creador:        string='';
  estado:         string='';
  motivo:         string='';
  id_tecnico:     string='';
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
