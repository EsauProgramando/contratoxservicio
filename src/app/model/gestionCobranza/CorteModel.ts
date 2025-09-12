export class CorteModel {
  id_corte: number = 0; // id_corte
  id_tipo: number = 0; // id_tipo
  id_cliente: number = 0; // id_cliente
  motivo_corte: string = ''; // motivo_corte
  fecha_corte: string = ''; // fecha_corte
  tipo_corte: number = 0; // tipo_corte
  responsable_corte: string = ''; // responsable_corte
  estado_corte: number = 0; // estado_corte
  fecha_reconexion: string | null = null; // fecha_reconexion que puede ser null
  observaciones: string = ''; // observaciones
  fechareg: string = ''; // fechareg
  creador: string = ''; // creador
  id_factura: number = 0; // id_factura
  op: number = 0; // op
  id_estado: number = 0; // id_estado
}
