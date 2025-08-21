import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestaTelefonica } from '../../core/interfaces/survey.interface';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from 'chart.js';

// Registrar los componentes necesarios de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('provinciaChart', { static: false }) provinciaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tamanoChart', { static: false }) tamanoChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tipoNegocioChart', { static: false }) tipoNegocioChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('elementosColocadosChart', { static: false }) elementosColocadosChartRef!: ElementRef<HTMLCanvasElement>;

  // Referencias para gráficos de Chips
  @ViewChild('operadoraChipChart', { static: false }) operadoraChipChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioCompraMovistarChart', { static: false })
  precioCompraMovistarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioVentaMovistarChart', { static: false }) precioVentaMovistarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioCompraTuentiChart', { static: false }) precioCompraTuentiChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioVentaTuentiChart', { static: false }) precioVentaTuentiChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioCompraClaroChart', { static: false }) precioCompraClaroChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioVentaClaroChart', { static: false }) precioVentaClaroChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioCompraCntChart', { static: false }) precioCompraCntChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('precioVentaCntChart', { static: false }) precioVentaCntChartRef!: ElementRef<HTMLCanvasElement>;

  // Referencias para gráficos de Recargas
  @ViewChild('operadoraRecargasChart', { static: false }) operadoraRecargasChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tipoNegocioRecargasChart', { static: false }) tipoNegocioRecargasChartRef!: ElementRef<HTMLCanvasElement>;

  encuestas: EncuestaTelefonica[] = [];
  loading = false;
  error = '';

  // Datos para los gráficos
  datosProvincia: any[] = [];
  datosTamano: any[] = [];
  datosTipoNegocio: any[] = [];
  datosElementosColocados: any[] = [];

  // Datos para gráficos de Chips
  datosOperadoraChip: any[] = [];
  datosPrecioCompraMovistar: any[] = [];
  datosPrecioVentaMovistar: any[] = [];
  datosPrecioCompraTuenti: any[] = [];
  datosPrecioVentaTuenti: any[] = [];
  datosPrecioCompraClaro: any[] = [];
  datosPrecioVentaClaro: any[] = [];
  datosPrecioCompraCnt: any[] = [];
  datosPrecioVentaCnt: any[] = [];

  // Datos para gráficos de Recargas
  datosOperadoraRecargas: any[] = [];
  datosTipoNegocioRecargas: any[] = [];

  // Instancias de Chart.js
  provinciaChart: Chart | null = null;
  tamanoChart: Chart | null = null;
  tipoNegocioChart: Chart | null = null;
  elementosColocadosChart: Chart | null = null;

  // Instancias para gráficos de Chips
  operadoraChipChart: Chart | null = null;
  precioCompraMovistarChart: Chart | null = null;
  precioVentaMovistarChart: Chart | null = null;
  precioCompraTuentiChart: Chart | null = null;
  precioVentaTuentiChart: Chart | null = null;
  precioCompraClaroChart: Chart | null = null;
  precioVentaClaroChart: Chart | null = null;
  precioCompraCntChart: Chart | null = null;
  precioVentaCntChart: Chart | null = null;

  // Instancias para gráficos de Recargas
  operadoraRecargasChart: Chart | null = null;
  tipoNegocioRecargasChart: Chart | null = null;

  // Propiedades para el dropdown de elementos
  elementosDropdownOpen = false;
  elementosDisponibles = [
    { value: 'internet', label: 'Banderola movistar' },
    { value: 'recargas', label: 'Banderola tuenti' },
    { value: 'chips', label: 'Tracker movistar' },
    { value: 'otros', label: 'Tracker tuenti' },
  ];
  elementosSeleccionados: string[] = [];

  // No necesitamos constructor ya que no usamos servicios

  ngOnInit(): void {
    // Inicializar con datos por defecto para mostrar los gráficos inmediatamente
    this.inicializarDatosPorDefecto();
    // No cargar encuestas del servicio, solo usar datos de ejemplo
    console.log('Usando datos de ejemplo para los gráficos');
  }

  ngAfterViewInit(): void {
    // Crear los gráficos con datos por defecto
    setTimeout(() => {
      this.crearGraficos();
    }, 100);

    // Agregar listener para cerrar el dropdown cuando se hace clic fuera
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        this.elementosDropdownOpen = false;
      }
    });
  }

  inicializarDatosPorDefecto(): void {
    // Datos por defecto para el gráfico de provincias (simulando datos reales)
    this.datosProvincia = [
      { provincia: 'Pichincha', valor: 921, porcentaje: 39, color: '#3B82F6' },
      { provincia: 'Guayas', valor: 574, porcentaje: 24, color: '#10B981' },
      { provincia: 'Santo Domingo', valor: 258, porcentaje: 11, color: '#F59E0B' },
      { provincia: 'Tungurahua', valor: 224, porcentaje: 10, color: '#EF4444' },
      { provincia: 'Cotopaxi', valor: 148, porcentaje: 6, color: '#8B5CF6' },
      { provincia: 'Esmeraldas', valor: 131, porcentaje: 6, color: '#06B6D4' },
      { provincia: 'Chimborazo', valor: 97, porcentaje: 4, color: '#84CC16' },
    ];

    // Datos por defecto para el gráfico de tamaño de local
    this.datosTamano = [
      { tamano: 'Mediano', valor: 876, porcentaje: 37, color: '#3B82F6' },
      { tamano: 'Grande', valor: 758, porcentaje: 32, color: '#10B981' },
      { tamano: 'Pequeño', valor: 719, porcentaje: 31, color: '#F59E0B' },
    ];

    // Datos por defecto para el gráfico de tipo de negocio
    this.datosTipoNegocio = [
      { tipo: 'Venta de celulares y accesorios', valor: 3942, porcentaje: 21, color: '#3B82F6' },
      { tipo: 'Bazar/papeleria', valor: 3822, porcentaje: 20, color: '#10B981' },
      { tipo: 'Farmacias', valor: 3313, porcentaje: 18, color: '#F59E0B' },
      { tipo: 'Tienda de barrio', valor: 2966, porcentaje: 16, color: '#EF4444' },
      { tipo: 'Otros negocios', valor: 2306, porcentaje: 12, color: '#8B5CF6' },
      { tipo: 'Cyber/cabinas', valor: 1612, porcentaje: 9, color: '#06B6D4' },
      { tipo: 'Minimercado Estandar', valor: 522, porcentaje: 3, color: '#84CC16' },
      { tipo: 'Ferreterias', valor: 177, porcentaje: 1, color: '#F97316' },
      { tipo: 'Pañaleras', valor: 153, porcentaje: 1, color: '#EC4899' },
      { tipo: 'Panaderías', valor: 67, porcentaje: 0, color: '#6366F1' },
    ];

    // Datos por defecto para el gráfico de elementos colocados
    this.datosElementosColocados = [
      { elemento: 'Ninguno', valor: 11267, porcentaje: 60, color: '#06B6D4' },
      { elemento: 'Banderola tuenti', valor: 3429, porcentaje: 18, color: '#10B981' },
      { elemento: 'Banderola movistar', valor: 2903, porcentaje: 15, color: '#3B82F6' },
      { elemento: 'Banderola movistar, Banderola tuenti', valor: 504, porcentaje: 3, color: '#F59E0B' },
      { elemento: 'Banderola tuenti, Tacker movistar', valor: 354, porcentaje: 2, color: '#EF4444' },
      { elemento: 'Tacker movistar', valor: 193, porcentaje: 1, color: '#8B5CF6' },
      { elemento: 'Banderola movistar, Tacker movistar', valor: 159, porcentaje: 1, color: '#84CC16' },
      { elemento: 'Banderola movistar, Tacker tuenti', valor: 64, porcentaje: 0, color: '#F97316' },
      { elemento: 'Banderola movistar, Banderola tuenti, Tacker tuenti', valor: 64, porcentaje: 0, color: '#EC4899' },
      { elemento: 'Banderola tuenti, Tacker tuenti', valor: 2, porcentaje: 0, color: '#6366F1' },
      { elemento: 'Banderola movistar, Banderola tuenti, Tacker movistar', valor: 4, porcentaje: 0, color: '#14B8A6' },
    ];

    // Datos para gráficos de Chips
    this.datosOperadoraChip = [
      { operadora: 'Movistar, CNT, Tuenti, Claro', valor: 3019, porcentaje: 41, color: '#3B82F6' },
      { operadora: 'Movistar, Tuenti, Claro', valor: 2655, porcentaje: 36, color: '#10B981' },
      { operadora: 'Claro', valor: 619, porcentaje: 8, color: '#F59E0B' },
      { operadora: 'Movistar, Tuenti', valor: 534, porcentaje: 7, color: '#EF4444' },
      { operadora: 'Movistar, Claro', valor: 259, porcentaje: 3, color: '#8B5CF6' },
      { operadora: 'Movistar', valor: 129, porcentaje: 2, color: '#06B6D4' },
      { operadora: 'Tuenti, Claro', valor: 74, porcentaje: 1, color: '#84CC16' },
      { operadora: 'Movistar, CNT, Tuenti', valor: 35, porcentaje: 0, color: '#F97316' },
      { operadora: 'Tuenti', valor: 20, porcentaje: 0, color: '#EC4899' },
      { operadora: 'Movistar, CNT, Claro', valor: 6, porcentaje: 0, color: '#6366F1' },
      { operadora: 'CNT, Claro', valor: 7, porcentaje: 0, color: '#14B8A6' },
      { operadora: 'CNT, Tuenti, Claro', valor: 6, porcentaje: 0, color: '#F472B6' },
      { operadora: 'Movistar, CNT, Tuenti', valor: 3, porcentaje: 0, color: '#A78BFA' },
      { operadora: 'Movistar, CNT', valor: 1, porcentaje: 0, color: '#34D399' },
      { operadora: 'Tuenti, CNT', valor: 1, porcentaje: 0, color: '#FBBF24' },
      { operadora: '(en blanco)', valor: 0, porcentaje: 0, color: '#9CA3AF' },
    ];

    // Precios Movistar
    this.datosPrecioCompraMovistar = [
      { precio: '1.25', valor: 487, porcentaje: 7, color: '#10B981' },
      { precio: '1.50', valor: 5329, porcentaje: 81, color: '#10B981' },
      { precio: '1.75', valor: 720, porcentaje: 11, color: '#10B981' },
      { precio: '2_o_mas', valor: 66, porcentaje: 1, color: '#10B981' },
      { precio: 'ninguna', valor: 96, porcentaje: 0, color: '#10B981' },
    ];

    this.datosPrecioVentaMovistar = [
      { precio: '3', valor: 4386, porcentaje: 67, color: '#10B981' },
      { precio: '3.50', valor: 1523, porcentaje: 23, color: '#10B981' },
      { precio: '4', valor: 563, porcentaje: 9, color: '#10B981' },
      { precio: '5_o_mas', valor: 19, porcentaje: 0, color: '#10B981' },
    ];

    // Precios Tuenti
    this.datosPrecioCompraTuenti = [
      { precio: '1.25', valor: 563, porcentaje: 9, color: '#06B6D4' },
      { precio: '1.50', valor: 4975, porcentaje: 79, color: '#06B6D4' },
      { precio: '1.75', valor: 659, porcentaje: 10, color: '#06B6D4' },
      { precio: '2_o_mas', valor: 118, porcentaje: 2, color: '#06B6D4' },
      { precio: 'ninguna', valor: 96, porcentaje: 0, color: '#06B6D4' },
    ];

    this.datosPrecioVentaTuenti = [
      { precio: '3', valor: 3723, porcentaje: 66, color: '#06B6D4' },
      { precio: '3.50', valor: 1086, porcentaje: 19, color: '#06B6D4' },
      { precio: '4', valor: 826, porcentaje: 15, color: '#06B6D4' },
      { precio: '5_o_mas', valor: 44, porcentaje: 1, color: '#06B6D4' },
    ];

    // Precios Claro
    this.datosPrecioCompraClaro = [
      { precio: '1', valor: 2, porcentaje: 0, color: '#EF4444' },
      { precio: '1.25', valor: 452, porcentaje: 8, color: '#EF4444' },
      { precio: '1.50', valor: 577, porcentaje: 10, color: '#EF4444' },
      { precio: '1.75', valor: 699, porcentaje: 12, color: '#EF4444' },
      { precio: '2_o_mas', valor: 4527, porcentaje: 69, color: '#EF4444' },
      { precio: 'ninguna', valor: 4, porcentaje: 0, color: '#EF4444' },
    ];

    this.datosPrecioVentaClaro = [
      { precio: '3', valor: 434, porcentaje: 9, color: '#EF4444' },
      { precio: '3.50', valor: 434, porcentaje: 9, color: '#EF4444' },
      { precio: '4', valor: 4347, porcentaje: 73, color: '#EF4444' },
      { precio: '4.5', valor: 385, porcentaje: 8, color: '#EF4444' },
      { precio: '5_o_mas', valor: 434, porcentaje: 9, color: '#EF4444' },
    ];

    // Precios CNT
    this.datosPrecioCompraCnt = [
      { precio: '1.25', valor: 533, porcentaje: 17, color: '#3B82F6' },
      { precio: '1.50', valor: 1840, porcentaje: 60, color: '#3B82F6' },
      { precio: '1.75', valor: 232, porcentaje: 8, color: '#3B82F6' },
      { precio: '2_o_mas', valor: 445, porcentaje: 14, color: '#3B82F6' },
    ];

    this.datosPrecioVentaCnt = [
      { precio: '0', valor: 16, porcentaje: 0, color: '#3B82F6' },
      { precio: '3', valor: 1878, porcentaje: 64, color: '#3B82F6' },
      { precio: '3.50', valor: 671, porcentaje: 23, color: '#3B82F6' },
      { precio: '4', valor: 385, porcentaje: 13, color: '#3B82F6' },
    ];

    // Datos para gráficos de Recargas
    this.datosOperadoraRecargas = [
      { operadora: 'Movistar, CNT, Tuenti, Claro', valor: 16369, porcentaje: 94, color: '#10B981' },
      { operadora: 'Movistar, Tuenti, Claro', valor: 554, porcentaje: 3, color: '#3B82F6' },
      { operadora: 'Claro', valor: 125, porcentaje: 1, color: '#F59E0B' },
      { operadora: 'Movistar, CNT, Tuenti', valor: 125, porcentaje: 1, color: '#EF4444' },
      { operadora: 'Movistar, Tuenti', valor: 69, porcentaje: 0, color: '#8B5CF6' },
      { operadora: 'Movistar, Claro', valor: 40, porcentaje: 0, color: '#06B6D4' },
      { operadora: 'Movistar, CNT, Claro', valor: 10, porcentaje: 0, color: '#84CC16' },
      { operadora: 'CNT, Tuenti, Claro', valor: 10, porcentaje: 0, color: '#F97316' },
      { operadora: 'Tuenti, Claro', valor: 10, porcentaje: 0, color: '#EC4899' },
      { operadora: 'Movistar, CNT', valor: 10, porcentaje: 0, color: '#6366F1' },
      { operadora: 'Movistar', valor: 10, porcentaje: 0, color: '#14B8A6' },
      { operadora: 'Tuenti', valor: 10, porcentaje: 0, color: '#F472B6' },
      { operadora: 'CNT, Claro', valor: 10, porcentaje: 0, color: '#A78BFA' },
      { operadora: '(en blanco)', valor: 10, porcentaje: 0, color: '#9CA3AF' },
    ];

    this.datosTipoNegocioRecargas = [
      { tipo: 'Venta de celulares y accesorios', valor: 3942, porcentaje: 21, color: '#3B82F6' },
      { tipo: 'Bazar/papeleria', valor: 3822, porcentaje: 20, color: '#10B981' },
      { tipo: 'Farmacias', valor: 3313, porcentaje: 18, color: '#F59E0B' },
      { tipo: 'Tienda de barrio', valor: 2966, porcentaje: 16, color: '#EF4444' },
      { tipo: 'Otros negocios', valor: 2306, porcentaje: 12, color: '#8B5CF6' },
      { tipo: 'Cyber/cabinas', valor: 1612, porcentaje: 9, color: '#06B6D4' },
      { tipo: 'Minimercado Estandar', valor: 522, porcentaje: 3, color: '#84CC16' },
      { tipo: 'Ferreterias', valor: 177, porcentaje: 1, color: '#F97316' },
      { tipo: 'Pañaleras', valor: 153, porcentaje: 1, color: '#EC4899' },
      { tipo: 'Panaderías', valor: 67, porcentaje: 0, color: '#6366F1' },
    ];

    // Datos de ejemplo para las encuestas
    this.encuestas = [
      {
        codigo: 'ENC001',
        nombre: 'Tienda El Sol',
        tipo_negocio: 'Venta de celulares y accesorios',
        tipo_encuesta: 'Colocación',
        grupo_negocio: 'Comercio',
        calle_principal: 'Av. Amazonas',
        calle_secundaria: 'Av. 6 de Diciembre',
        nomenclatura: 'N45-123',
        area_geografica: 'Centro Norte',
        latitud: '-0.2299',
        longitud: '-78.5249',
        provincia: 'Pichincha',
        canton: 'Quito',
        parroquia: 'Centro',
        vende_chips: 'Sí',
        de_que_operadora_vende_chips: 'Movistar, Tuenti',
        valor_compra_simcard_movistar: '5.00',
        valor_venta_simcard_movistar: '8.00',
        valor_compra_simcard_tuenti: '4.50',
        valor_venta_simcard_tuenti: '7.50',
        valor_compra_simcard_claro: '5.50',
        valor_venta_simcard_claro: '8.50',
        valor_compra_simcard_cnt: '4.00',
        valor_venta_simcard_cnt: '7.00',
        proporcion_chips_movistar: '60',
        proporcion_chips_tuenti: '40',
        stock_actual_movistar: '50',
        stock_actual_tuenti: '30',
        vende_recargas: 'Sí',
        de_que_operadora_vende_recargas: 'Movistar, Tuenti, Claro',
        elementos_actualmente_en_tienda: 'Banderolas, Trackers',
        elementos_colocados_en_visita: 'Banderola Movistar, Tracker Tuenti',
        imagen_antes: 'antes_001.jpg',
        imagen_despues: 'despues_001.jpg',
        fecha: '2024-01-15T10:30:00',
      },
      {
        codigo: 'ENC002',
        nombre: 'Farmacia San José',
        tipo_negocio: 'Farmacias',
        tipo_encuesta: 'Censo',
        grupo_negocio: 'Salud',
        calle_principal: 'Av. 9 de Octubre',
        calle_secundaria: 'Av. Boyacá',
        nomenclatura: 'N45-456',
        area_geografica: 'Centro Sur',
        latitud: '-2.1896',
        longitud: '-79.8895',
        provincia: 'Guayas',
        canton: 'Guayaquil',
        parroquia: 'Centro',
        vende_chips: 'No',
        de_que_operadora_vende_chips: '',
        valor_compra_simcard_movistar: '0.00',
        valor_venta_simcard_movistar: '0.00',
        valor_compra_simcard_tuenti: '0.00',
        valor_venta_simcard_tuenti: '0.00',
        valor_compra_simcard_claro: '0.00',
        valor_venta_simcard_claro: '0.00',
        valor_compra_simcard_cnt: '0.00',
        valor_venta_simcard_cnt: '0.00',
        proporcion_chips_movistar: '0',
        proporcion_chips_tuenti: '0',
        stock_actual_movistar: '0',
        stock_actual_tuenti: '0',
        vende_recargas: 'Sí',
        de_que_operadora_vende_recargas: 'Movistar, Tuenti',
        elementos_actualmente_en_tienda: 'Ninguno',
        elementos_colocados_en_visita: 'Ninguno',
        imagen_antes: 'antes_002.jpg',
        imagen_despues: 'despues_002.jpg',
        fecha: '2024-01-16T14:20:00',
      },
      {
        codigo: 'ENC003',
        nombre: 'Bazar La Esquina',
        tipo_negocio: 'Bazar/papeleria',
        tipo_encuesta: 'Colocación',
        grupo_negocio: 'Comercio',
        calle_principal: 'Av. Cevallos',
        calle_secundaria: 'Av. 12 de Noviembre',
        nomenclatura: 'N45-789',
        area_geografica: 'Centro',
        latitud: '-1.2419',
        longitud: '-78.6197',
        provincia: 'Tungurahua',
        canton: 'Ambato',
        parroquia: 'Ficoa',
        vende_chips: 'Sí',
        de_que_operadora_vende_chips: 'Movistar, Claro',
        valor_compra_simcard_movistar: '5.00',
        valor_venta_simcard_movistar: '8.00',
        valor_compra_simcard_tuenti: '0.00',
        valor_venta_simcard_tuenti: '0.00',
        valor_compra_simcard_claro: '5.50',
        valor_venta_simcard_claro: '8.50',
        valor_compra_simcard_cnt: '0.00',
        valor_venta_simcard_cnt: '0.00',
        proporcion_chips_movistar: '70',
        proporcion_chips_tuenti: '0',
        stock_actual_movistar: '40',
        stock_actual_tuenti: '0',
        vende_recargas: 'Sí',
        de_que_operadora_vende_recargas: 'Movistar, Claro',
        elementos_actualmente_en_tienda: 'Banderola Claro',
        elementos_colocados_en_visita: 'Banderola Movistar',
        imagen_antes: 'antes_003.jpg',
        imagen_despues: 'despues_003.jpg',
        fecha: '2024-01-17T09:15:00',
      },
    ];
  }

  // Los datos ya están inicializados estáticamente, no necesitamos cargarlos del servicio

  // Los datos ya están inicializados estáticamente, no necesitamos prepararlos

  crearGraficos(): void {
    console.log('Creando gráficos con datos de ejemplo...');

    if (this.provinciaChartRef && this.tamanoChartRef && this.tipoNegocioChartRef && this.elementosColocadosChartRef) {
      this.crearGraficoProvincias();
      this.crearGraficoTamano();
      this.crearGraficoTipoNegocio();
      this.crearGraficoElementosColocados();
    } else {
      console.error('No se encontraron las referencias de los canvas');
    }

    // Crear gráficos de Chips si están disponibles
    if (
      this.operadoraChipChartRef &&
      this.precioCompraMovistarChartRef &&
      this.precioVentaMovistarChartRef &&
      this.precioCompraTuentiChartRef &&
      this.precioVentaTuentiChartRef &&
      this.precioCompraClaroChartRef &&
      this.precioVentaClaroChartRef &&
      this.precioCompraCntChartRef &&
      this.precioVentaCntChartRef
    ) {
      this.crearGraficosChips();
    }

    // Crear gráficos de Recargas si están disponibles
    if (this.operadoraRecargasChartRef && this.tipoNegocioRecargasChartRef) {
      this.crearGraficosRecargas();
    }
  }

  // No necesitamos actualizar gráficos ya que los datos son estáticos

  crearGraficoProvincias(): void {
    console.log('Creando gráfico de provincias...');
    const ctx = this.provinciaChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Configuración para Chart.js v4 usando datos estáticos
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosProvincia.map(
          (item) => `${item.provincia}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Encuestas',
            data: this.datosProvincia.map((item) => item.valor),
            backgroundColor: this.datosProvincia.map((item) => item.color),
            borderColor: this.datosProvincia.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosProvincia[context.dataIndex];
                return `${item.provincia}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              callback: (value, index) => {
                const item = this.datosProvincia[index];
                return `${item.provincia}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.provinciaChart = new Chart(ctx, config);
      console.log('Gráfico de provincias creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de provincias:', error);
    }
  }

  crearGraficoTamano(): void {
    console.log('Creando gráfico de tamaño...');
    const ctx = this.tamanoChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Configuración para Chart.js v4 usando datos estáticos
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosTamano.map((item) => `${item.tamano}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`),
        datasets: [
          {
            label: 'Tamaño',
            data: this.datosTamano.map((item) => item.valor),
            backgroundColor: this.datosTamano.map((item) => item.color),
            borderColor: this.datosTamano.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosTamano[context.dataIndex];
                return `${item.tamano}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              callback: (value, index) => {
                const item = this.datosTamano[index];
                return `${item.tamano}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.tamanoChart = new Chart(ctx, config);
      console.log('Gráfico de tamaño creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de tamaño:', error);
    }
  }

  crearGraficoTipoNegocio(): void {
    console.log('Creando gráfico de tipo de negocio...');
    const ctx = this.tipoNegocioChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Configuración para Chart.js v4
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosTipoNegocio.map(
          (item) => `${item.tipo}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Tipo de Negocio',
            data: this.datosTipoNegocio.map((item) => item.valor),
            backgroundColor: this.datosTipoNegocio.map((item) => item.color),
            borderColor: this.datosTipoNegocio.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosTipoNegocio[context.dataIndex];
                return `${item.tipo}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              callback: (value, index) => {
                const item = this.datosTipoNegocio[index];
                return `${item.tipo}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.tipoNegocioChart = new Chart(ctx, config);
      console.log('Gráfico de tipo de negocio creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de tipo de negocio:', error);
    }
  }

  crearGraficoElementosColocados(): void {
    console.log('Creando gráfico de elementos colocados...');
    const ctx = this.elementosColocadosChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Configuración para Chart.js v4 usando datos estáticos
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosElementosColocados.map(
          (item) => `${item.elemento}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Elementos Colocados',
            data: this.datosElementosColocados.map((item) => item.valor),
            backgroundColor: this.datosElementosColocados.map((item) => item.color),
            borderColor: this.datosElementosColocados.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // Hacer el gráfico horizontal
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosElementosColocados[context.dataIndex];
                return `${item.elemento}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              callback: (value, index) => {
                const item = this.datosElementosColocados[index];
                return `${item.elemento}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.elementosColocadosChart = new Chart(ctx, config);
      console.log('Gráfico de elementos colocados creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de elementos colocados:', error);
    }
  }

  crearGraficosChips(): void {
    console.log('Creando gráficos de Chips...');
    this.crearGraficoOperadoraChip();
    this.crearGraficoPrecioCompraMovistar();
    this.crearGraficoPrecioVentaMovistar();
    this.crearGraficoPrecioCompraTuenti();
    this.crearGraficoPrecioVentaTuenti();
    this.crearGraficoPrecioCompraClaro();
    this.crearGraficoPrecioVentaClaro();
    this.crearGraficoPrecioCompraCnt();
    this.crearGraficoPrecioVentaCnt();
  }

  crearGraficoOperadoraChip(): void {
    console.log('Creando gráfico de operadora chip...');
    const ctx = this.operadoraChipChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosOperadoraChip.map(
          (item) => `${item.operadora}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Operadoras',
            data: this.datosOperadoraChip.map((item) => item.valor),
            backgroundColor: this.datosOperadoraChip.map((item) => item.color),
            borderColor: this.datosOperadoraChip.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosOperadoraChip[context.dataIndex];
                return `${item.operadora}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              callback: (value, index) => {
                const item = this.datosOperadoraChip[index];
                return `${item.operadora}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.operadoraChipChart = new Chart(ctx, config);
      console.log('Gráfico de operadora chip creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de operadora chip:', error);
    }
  }

  crearGraficoPrecioCompraMovistar(): void {
    console.log('Creando gráfico de precio compra Movistar...');
    const ctx = this.precioCompraMovistarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioCompraMovistar.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Compra',
            data: this.datosPrecioCompraMovistar.map((item) => item.valor),
            backgroundColor: this.datosPrecioCompraMovistar.map((item) => item.color),
            borderColor: this.datosPrecioCompraMovistar.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioCompraMovistar[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioCompraMovistar[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioCompraMovistarChart = new Chart(ctx, config);
      console.log('Gráfico de precio compra Movistar creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio compra Movistar:', error);
    }
  }

  crearGraficoPrecioVentaMovistar(): void {
    console.log('Creando gráfico de precio venta Movistar...');
    const ctx = this.precioVentaMovistarChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioVentaMovistar.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Venta',
            data: this.datosPrecioVentaMovistar.map((item) => item.valor),
            backgroundColor: this.datosPrecioVentaMovistar.map((item) => item.color),
            borderColor: this.datosPrecioVentaMovistar.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioVentaMovistar[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioVentaMovistar[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioVentaMovistarChart = new Chart(ctx, config);
      console.log('Gráfico de precio venta Movistar creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio venta Movistar:', error);
    }
  }

  crearGraficoPrecioCompraTuenti(): void {
    console.log('Creando gráfico de precio compra Tuenti...');
    const ctx = this.precioCompraTuentiChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioCompraTuenti.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Compra',
            data: this.datosPrecioCompraTuenti.map((item) => item.valor),
            backgroundColor: this.datosPrecioCompraTuenti.map((item) => item.color),
            borderColor: this.datosPrecioCompraTuenti.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioCompraTuenti[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioCompraTuenti[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioCompraTuentiChart = new Chart(ctx, config);
      console.log('Gráfico de precio compra Tuenti creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio compra Tuenti:', error);
    }
  }

  crearGraficoPrecioVentaTuenti(): void {
    console.log('Creando gráfico de precio venta Tuenti...');
    const ctx = this.precioVentaTuentiChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioVentaTuenti.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Venta',
            data: this.datosPrecioVentaTuenti.map((item) => item.valor),
            backgroundColor: this.datosPrecioVentaTuenti.map((item) => item.color),
            borderColor: this.datosPrecioVentaTuenti.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioVentaTuenti[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioVentaTuenti[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioVentaTuentiChart = new Chart(ctx, config);
      console.log('Gráfico de precio venta Tuenti creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio venta Tuenti:', error);
    }
  }

  crearGraficoPrecioCompraClaro(): void {
    console.log('Creando gráfico de precio compra Claro...');
    const ctx = this.precioCompraClaroChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioCompraClaro.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Compra',
            data: this.datosPrecioCompraClaro.map((item) => item.valor),
            backgroundColor: this.datosPrecioCompraClaro.map((item) => item.color),
            borderColor: this.datosPrecioCompraClaro.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioCompraClaro[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioCompraClaro[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioCompraClaroChart = new Chart(ctx, config);
      console.log('Gráfico de precio compra Claro creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio compra Claro:', error);
    }
  }

  crearGraficoPrecioVentaClaro(): void {
    console.log('Creando gráfico de precio venta Claro...');
    const ctx = this.precioVentaClaroChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioVentaClaro.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Venta',
            data: this.datosPrecioVentaClaro.map((item) => item.valor),
            backgroundColor: this.datosPrecioVentaClaro.map((item) => item.color),
            borderColor: this.datosPrecioVentaClaro.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioVentaClaro[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioVentaClaro[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioVentaClaroChart = new Chart(ctx, config);
      console.log('Gráfico de precio venta Claro creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio venta Claro:', error);
    }
  }

  crearGraficoPrecioCompraCnt(): void {
    console.log('Creando gráfico de precio compra CNT...');
    const ctx = this.precioCompraCntChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioCompraCnt.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Compra',
            data: this.datosPrecioCompraCnt.map((item) => item.valor),
            backgroundColor: this.datosPrecioCompraCnt.map((item) => item.color),
            borderColor: this.datosPrecioCompraCnt.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioCompraCnt[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioCompraCnt[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioCompraCntChart = new Chart(ctx, config);
      console.log('Gráfico de precio compra CNT creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio compra CNT:', error);
    }
  }

  crearGraficoPrecioVentaCnt(): void {
    console.log('Creando gráfico de precio venta CNT...');
    const ctx = this.precioVentaCntChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosPrecioVentaCnt.map(
          (item) => `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Precio Venta',
            data: this.datosPrecioVentaCnt.map((item) => item.valor),
            backgroundColor: this.datosPrecioVentaCnt.map((item) => item.color),
            borderColor: this.datosPrecioVentaCnt.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosPrecioVentaCnt[context.dataIndex];
                return `Precio ${item.precio}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              callback: (value, index) => {
                const item = this.datosPrecioVentaCnt[index];
                return `${item.precio}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.precioVentaCntChart = new Chart(ctx, config);
      console.log('Gráfico de precio venta CNT creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de precio venta CNT:', error);
    }
  }

  crearGraficosRecargas(): void {
    console.log('Creando gráficos de Recargas...');
    this.crearGraficoOperadoraRecargas();
    this.crearGraficoTipoNegocioRecargas();
  }

  crearGraficoOperadoraRecargas(): void {
    console.log('Creando gráfico de operadora recargas...');
    const ctx = this.operadoraRecargasChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosOperadoraRecargas.map(
          (item) => `${item.operadora}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Operadoras de Recargas',
            data: this.datosOperadoraRecargas.map((item) => item.valor),
            backgroundColor: this.datosOperadoraRecargas.map((item) => item.color),
            borderColor: this.datosOperadoraRecargas.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosOperadoraRecargas[context.dataIndex];
                return `${item.operadora}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              callback: (value, index) => {
                const item = this.datosOperadoraRecargas[index];
                return `${item.operadora}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.operadoraRecargasChart = new Chart(ctx, config);
      console.log('Gráfico de operadora recargas creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de operadora recargas:', error);
    }
  }

  crearGraficoTipoNegocioRecargas(): void {
    console.log('Creando gráfico de tipo de negocio para recargas...');
    const ctx = this.tipoNegocioRecargasChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.datosTipoNegocioRecargas.map(
          (item) => `${item.tipo}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`,
        ),
        datasets: [
          {
            label: 'Tipo de Negocio',
            data: this.datosTipoNegocioRecargas.map((item) => item.valor),
            backgroundColor: this.datosTipoNegocioRecargas.map((item) => item.color),
            borderColor: this.datosTipoNegocioRecargas.map((item) => item.color),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = this.datosTipoNegocioRecargas[context.dataIndex];
                return `${item.tipo}: ${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.1)' },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
          x: {
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 0,
              callback: (value, index) => {
                const item = this.datosTipoNegocioRecargas[index];
                return `${item.tipo}\n${item.valor.toLocaleString()} (${item.porcentaje}%)`;
              },
            },
          },
        },
      },
    };

    try {
      this.tipoNegocioRecargasChart = new Chart(ctx, config);
      console.log('Gráfico de tipo de negocio para recargas creado exitosamente');
    } catch (error) {
      console.error('Error al crear el gráfico de tipo de negocio para recargas:', error);
    }
  }

  getRandomColor(): string {
    const colors = [
      '#3B82F6',
      '#10B981',
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#06B6D4',
      '#84CC16',
      '#F97316',
      '#EC4899',
      '#6366F1',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Métodos computados para las estadísticas
  get totalEncuestas(): number {
    return this.encuestas.length;
  }

  get encuestasConChips(): number {
    return this.encuestas.filter((e) => e.vende_chips === '"Sí"').length;
  }

  get encuestasConRecargas(): number {
    return this.encuestas.filter((e) => e.vende_recargas === '"Sí"').length;
  }

  get totalProvincias(): number {
    return this.encuestas.length > 0 ? new Set(this.encuestas.map((e) => e.provincia)).size : 0;
  }

  parsearElementos(elementosString: string): string[] {
    try {
      return JSON.parse(elementosString);
    } catch {
      return [elementosString];
    }
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Métodos para el dropdown de elementos
  toggleElementosDropdown(): void {
    this.elementosDropdownOpen = !this.elementosDropdownOpen;
  }

  toggleElementoSeleccionado(value: string): void {
    const index = this.elementosSeleccionados.indexOf(value);
    if (index > -1) {
      this.elementosSeleccionados.splice(index, 1);
    } else {
      this.elementosSeleccionados.push(value);
    }
    console.log('Elementos seleccionados:', this.elementosSeleccionados);

    // Aplicar filtros automáticamente
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    if (this.elementosSeleccionados.length > 0) {
      console.log('Aplicando filtros para:', this.elementosSeleccionados);
      // Aquí puedes implementar la lógica para filtrar los datos
      // Por ejemplo, filtrar las encuestas basándose en los elementos seleccionados
      this.filtrarEncuestasPorElementos();
    } else {
      console.log('Mostrando todas las encuestas');
      // Los datos ya están cargados estáticamente
    }
  }

  filtrarEncuestasPorElementos(): void {
    // Implementar lógica de filtrado basada en los elementos seleccionados
    // Por ahora solo logueamos la acción
    console.log('Filtrando encuestas por elementos:', this.elementosSeleccionados);

    // Aquí puedes implementar la lógica real de filtrado
    // Por ejemplo:
    // this.encuestasFiltradas = this.encuestas.filter(encuesta => {
    //   return this.elementosSeleccionados.some(elemento =>
    //     encuesta.elementos.includes(elemento)
    //   );
    // });
  }

  limpiarElementosSeleccionados(): void {
    this.elementosSeleccionados = [];
    console.log('Elementos limpiados');
  }

  limpiarFiltros(): void {
    this.elementosSeleccionados = [];
    // Aquí puedes agregar más lógica para limpiar otros filtros si los tienes
    console.log('Todos los filtros han sido limpiados');
  }

  getElementosSeleccionadosText(): string {
    if (this.elementosSeleccionados.length === 0) {
      return 'Seleccionar elementos...';
    } else if (this.elementosSeleccionados.length === this.elementosDisponibles.length) {
      return 'Todos los elementos';
    } else if (this.elementosSeleccionados.length === 1) {
      const elemento = this.elementosDisponibles.find((e) => e.value === this.elementosSeleccionados[0]);
      return elemento ? elemento.label : 'Elemento seleccionado';
    } else {
      return `${this.elementosSeleccionados.length} elementos seleccionados`;
    }
  }
}
