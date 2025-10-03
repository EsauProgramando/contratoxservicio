import { FacturasNociacionItemModel } from './FacturasNociacionItemModel';

export class NegociacionModel {
  id_cliente: number = 0;
  id_contrato: number = 0;
  id_negociacion: number = 0;
  id_tipo: number = 0;
  canal_preferido: string = 'WHATSAPP';
  acciones_negociacion: string = '';
  montopagar_inicial: number = 0;
  fecha_vencimiento_nuevo: string = ''; // formato yyyy-MM-dd
  periodo_gracia: number = 0;
  usuario_crea: string = '';
  observaciones: string = '';
  auto_recordatorio: number = 1;
  frecuencia_dias: number = 3;
  monto_total: number = 0;
  facturas: FacturasNociacionItemModel[] = [];
  //aumente
  fecha_inicio: string = ''; // formato yyyy-MM-dd
  fecha_fin: string = ''; // formato yyyy-MM-dd
  //extra
  nombre_completo: string = '';
  nrodocident: string = '';
  email: string = '';
  telefono: string = '';
  estado: string = '';
}
