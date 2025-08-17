import { ContratoResponse } from './contratoResponse';
import { ServicioContratadoRequest } from './servicioContratadoRequest';

export class Detalle_contratoxservicioRequest {
  cab: ContratoResponse = new ContratoResponse();
  ite: ServicioContratadoRequest[] = [];
}
