export interface EncuestaTelefonica {
  codigo: string;
  nombre: string;
  tipo_negocio: string;
  tipo_encuesta: string;
  grupo_negocio: string;
  calle_principal: string;
  calle_secundaria: string;
  nomenclatura: string;
  area_geografica: string;
  latitud: string;
  longitud: string;
  provincia: string;
  canton: string;
  parroquia: string;
  vende_chips: string;
  de_que_operadora_vende_chips: string;
  valor_compra_simcard_movistar: string;
  valor_venta_simcard_movistar: string;
  valor_compra_simcard_tuenti: string;
  valor_venta_simcard_tuenti: string;
  valor_compra_simcard_claro: string;
  valor_venta_simcard_claro: string;
  valor_compra_simcard_cnt: string;
  valor_venta_simcard_cnt: string;
  proporcion_chips_movistar: string;
  proporcion_chips_tuenti: string;
  stock_actual_movistar: string;
  stock_actual_tuenti: string;
  vende_recargas: string;
  de_que_operadora_vende_recargas: string;
  elementos_actualmente_en_tienda: string;
  elementos_colocados_en_visita: string;
  imagen_antes: string;
  imagen_despues: string;
  fecha: string;
}

export interface SurveyTelefonicaResponse {
  ok: boolean;
  encuestas: EncuestaTelefonica[];
  total: string;
  desde: number;
  limit: number;
}
