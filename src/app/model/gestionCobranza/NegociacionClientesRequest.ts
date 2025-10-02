export class NegociacionClientesRequest {
  id_negociacion: number = 0;
  id_cliente: number = 0;
  id_contrato: number = 0;
  id_tipo: number = 0;

  canal_preferido: string = '';
  acciones_negociacion: string = '';

  auto_recordatorio: number = 0;
  frecuencia_dias: number = 0;

  fecha_inicio: string = '';
  fecha_fin: string = '';
  estado: string = '';

  montopagar_inicial: number = 0;

  fecha_vencimiento_nuevo: string = '';
  periodo_gracia: number = 0;
  tipodocident: number = 0;

  observaciones: string = '';
  usuario_crea: string = '';
  fechareg: string = '';
  email: string = '';
  telefono: string = '';
  nrodocident: string = '';
}
