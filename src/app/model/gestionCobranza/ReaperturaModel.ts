export class ReaperturaModel {
  id_reapertura: number = 0; // id_reapertura
  id_tipo: number = 0; // id_tipo
  id_cliente: number = 0; // id_cliente
  fecha_reconexion: string = ''; // fecha_reconexion
  motivo_reconexion: string = ''; // motivo_reconexion
  observaciones?: string = ''; // observaciones (opcional)
  estado_reconexion: number = 0; // estado_reconexion (0 = pendiente, 1 = reconectado)
  responsable_reconexion: string = ''; // responsable_reconexion
  fechareg: string = ''; // fechareg
  creador: string = ''; // creador
  id_corte: number = 0; // id_corte
  op: number = 1; // op 1 = insertar, 2 = actualizar, 3 = eliminar
  id_estado: number = 0; // id_estado
}
