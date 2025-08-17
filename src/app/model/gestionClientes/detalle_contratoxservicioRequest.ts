import { ContratoResponse } from './ContratoResponse';
import { ServicioContratadoRequest } from './ServicioContratadoRequest';

export class Detalle_contratoxservicioRequest {
  cab: ContratoResponse = new ContratoResponse();
  ite: ServicioContratadoRequest[] = [];
}
