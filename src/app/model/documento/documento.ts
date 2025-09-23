export class creardocumentoModel {
  codigoFactura:          string='';
  tipoComprobante:        string='';
  tipoDocumentoCliente:   string='';
  numeroDocumentoCliente: string='';
  nombreCliente:          string='';
  razonSocialCliente:     string='';
  direccionCliente:       string='';
}

export interface ResponsedocData {
  idResultado: number;
  resultado:   string;
  value:       Value;
  values:      Value[];
}

export interface Value {
  idDocumento:            number;
  idContrato:             number;
  tipoComprobante:        string;
  tipoDocumentoCliente:   string;
  numeroDocumentoCliente: string;
  nombreCliente:          string;
  razonSocialCliente:     string;
  direccionCliente:       string;
  serie:                  string;
  correlativo:            string;
  fechaEmision:           Date;
  codigoHash:             string;
  cadenaQr:               string;
  responseCode:           number;
  estado:                 string;
  mensaje:                string;
  xmlBase64:              string;
  xmlCdrBase64:           string;
  urlPdf:                 string;
  fechaCreacion:          Date;
}
export interface respuestaFactura {
  idResultado: number;
  resultado:   string;
  value:       string;
  values:      string[];
}
