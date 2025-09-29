export class PagosModel {
  id_pago: number = 0;
  id_factura: number = 0;
  id_cliente: number = 0;
  id_metodo: number = 0;
  fecha_pago: string = '';
  monto_pagado: number = 0;
  numero_operacion: string = '';
  adjunto_boleta: string = '';
  id_adjuntaboleta: string = '';
  observaciones: string = '';
  creador: string = '';
  codigo_factura: string = '';
  ticket: string = '';
  monto_confirmado: number = 0;
  fecharevision: string = '';
  observacion_vache: string = '';
  motivo_rechaso: string = '';
  //otros campos
  nombre_completo: string = '';
  saldo: number = 0;
}
