export class BajaMorosidadModel {
  id_baja: number = 0;
  id_cliente: number = 0;
  fecharebaja: string = '';
  id_tipo: number = 0;
  estado: string = ''; // 'ACTIVO','INHABILITADO','INDEFINIDO'
  observacion: string = '';
  motivo: string = '';
  creador: string = '';
  //extra no modelo
  cliente: string = '';
  nrodocident: string = '';
  op: number = 0; //1 registra , 2 actualiza , 3 debaja, 4 activa
}
