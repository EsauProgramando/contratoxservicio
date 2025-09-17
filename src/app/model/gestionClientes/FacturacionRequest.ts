export class FacturacionRequest {
  id_factura: number = 0;
  id_tipo: number = 0;
  codigo_factura: string = '';
  id_contrato: number = 0;
  id_cliente: number = 0;
  nombre_completo: string = '';
  periodo: string = '';
  fecha_emision: string = '';
  fecha_vencimiento: string = '';
  monto: number = 0;
  saldo: number = 0;
  estado: string = '';
  dias_mora: number = 0;
  observaciones: string = '';
  estareg: boolean = false;
  fechareg: number = 0;
  desctipo: string = '';
  email: string = '';
  nrodocident:string='';
  tipodocident:number=0;
  direccion:string='';
  url_pdf:string=''
}
