import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor() { }
  generarwhatsapPlantillaCortesPendientes(telefono: string, nombre: string,  periodo: string, monto: number): string {
    const mensaje = `Estimado/a ${nombre}, le recordamos que su servicio correspondiente al periodo ${periodo} tiene un monto pendiente de pago de S/. ${monto.toFixed(2)}. Por favor, realice el pago a la brevedad para evitar inconvenientes. Gracias por su atención.`;
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    return url;
  }
  generarwhatsparamorosidad(telefono: string, nombre: string,  deuda_actual_soles: number,  dias_en_mora: number): string {
    const mensaje = `Estimado/a ${nombre}, le informamos que su cuenta presenta una deuda actual de S/. ${deuda_actual_soles.toFixed(2)} y se encuentra en mora por ${dias_en_mora} días. Le solicitamos regularizar su situación a la brevedad para evitar mayores inconvenientes. Gracias por su atención.`;
    const url = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
    return url;
  }
  
}
