export class ServicioContratadoRequest {
  id_contrato: number = 0;
  id_cliente: number = 0;
  cliente: string = '';
  fecha_contrato: string = '';
  observaciones: string = '';
  tipo_servicio: string = '';
  plan: string = '';
  velocidad: string = '';
  precio_mensual: number = 0;
  fecha_activacion: string = '';
  estado_contrato: boolean = true;
  estado_servicio: boolean = true;
  ip_fija: boolean = false;
}
