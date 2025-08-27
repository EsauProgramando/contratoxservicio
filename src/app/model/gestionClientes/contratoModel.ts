import { Servicios_contratadosModel } from './servicios_contratadosModel';
export class ContratoModel {
  id_contrato: number = 0;
  id_cliente: number = 0;
  fecha_contrato: string = '';
  observaciones: string = '';
  url_soporte_contrato: string = '';
  url_documento: string = '';
  url_croquis: string = '';
  estareg: number = 1;
  fechareg: string = '';
  creador: string = '';
  fechabaja: string = '';
  observacion_baja: string = '';
  id_soporte_contrato: string = '';
  id_documento: string = '';
  id_croquis: string = '';
  tiempo_contrato: number = 0;
  periodo_gracia: number = 0;
  id_tipo: number = 0;
  detalle: Servicios_contratadosModel[] = [];
}
