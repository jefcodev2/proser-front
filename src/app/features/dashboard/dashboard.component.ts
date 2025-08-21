import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyService } from '../../services/survey.service';
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
  providers: [SurveyService],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('provinciaChart', { static: false }) provinciaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tamanoChart', { static: false }) tamanoChartRef!: ElementRef<HTMLCanvasElement>;

  encuestas: EncuestaTelefonica[] = [];
  loading = false;
  error = '';

  // Datos para los gráficos
  datosProvincia: any[] = [];
  datosTamano: any[] = [];

  // Instancias de Chart.js
  provinciaChart: Chart | null = null;
  tamanoChart: Chart | null = null;

  // Propiedades para el dropdown de elementos
  elementosDropdownOpen = false;
  elementosDisponibles = [
    { value: 'internet', label: 'Internet' },
    { value: 'recargas', label: 'Recargas' },
    { value: 'chips', label: 'Chips' },
    { value: 'otros', label: 'Otros' },
  ];
  elementosSeleccionados: string[] = [];

  constructor(private surveyService: SurveyService) {}

  ngOnInit(): void {
    // Inicializar con datos por defecto para mostrar los gráficos inmediatamente
    this.inicializarDatosPorDefecto();
    this.cargarEncuestas();
    console.log('encuestas', this.encuestas);
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
  }

  cargarEncuestas(): void {
    this.loading = true;
    this.error = '';

    this.surveyService.getEncuestasTelefonicas().subscribe({
      next: (response) => {
        if (response.ok && response.encuestas && response.encuestas.length > 0) {
          this.encuestas = response.encuestas;
          this.prepararDatosGraficos();
          this.actualizarGraficos();
        } else {
          // Si no hay datos, mantener los datos por defecto
          console.log('No hay datos de encuestas, usando datos por defecto');
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error de conexión: ' + err.message;
        this.loading = false;
        // En caso de error, mantener los datos por defecto
        console.log('Error al cargar encuestas, usando datos por defecto');
      },
    });
  }

  prepararDatosGraficos(): void {
    // Preparar datos para el gráfico de provincias
    const provinciasCount = this.encuestas.reduce((acc, encuesta) => {
      acc[encuesta.provincia] = (acc[encuesta.provincia] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const totalProvincias = Object.values(provinciasCount).reduce((sum, count) => sum + count, 0);

    this.datosProvincia = Object.entries(provinciasCount)
      .map(([provincia, count]) => ({
        provincia,
        valor: count,
        porcentaje: Math.round((count / totalProvincias) * 100),
        color: this.getRandomColor(),
      }))
      .sort((a, b) => b.valor - a.valor);

    // Preparar datos para el gráfico de tamaño de local (simulado)
    // En un caso real, esto vendría de los datos de la encuesta
    this.datosTamano = [
      { tamano: 'Mediano', valor: 876, porcentaje: 37, color: '#3B82F6' },
      { tamano: 'Grande', valor: 758, porcentaje: 32, color: '#10B981' },
      { tamano: 'Pequeño', valor: 719, porcentaje: 31, color: '#F59E0B' },
    ];
  }

  crearGraficos(): void {
    console.log('Creando gráficos...');
    console.log('provinciaChartRef:', this.provinciaChartRef);
    console.log('tamanoChartRef:', this.tamanoChartRef);
    console.log('datosProvincia:', this.datosProvincia);
    console.log('datosTamano:', this.datosTamano);

    if (this.provinciaChartRef && this.tamanoChartRef) {
      this.crearGraficoProvincias();
      this.crearGraficoTamano();
    } else {
      console.error('No se encontraron las referencias de los canvas');
    }
  }

  actualizarGraficos(): void {
    if (this.provinciaChart && this.tamanoChart) {
      // Destruir gráficos existentes y crear nuevos
      this.provinciaChart.destroy();
      this.tamanoChart.destroy();
      this.crearGraficos();
    }
  }

  crearGraficoProvincias(): void {
    console.log('Creando gráfico de provincias...');
    const ctx = this.provinciaChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D');
      return;
    }

    // Configuración para Chart.js v4
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Pichincha', 'Guayas', 'Santo Domingo', 'Tungurahua', 'Cotopaxi', 'Esmeraldas', 'Chimborazo'],
        datasets: [
          {
            label: 'Encuestas',
            data: [921, 574, 258, 224, 148, 131, 97],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'],
            borderColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16'],
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
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
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

    // Configuración para Chart.js v4
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: ['Mediano', 'Grande', 'Pequeño'],
        datasets: [
          {
            label: 'Tamaño',
            data: [876, 758, 719],
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
            borderColor: ['#3B82F6', '#10B981', '#F59E0B'],
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
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          x: {
            grid: {
              display: false,
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
      // Mostrar todas las encuestas si no hay filtros
      this.cargarEncuestas();
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
