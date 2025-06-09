<template>
  <div class="pacientes-wrapper">
    <header class="app-header">
      <div class="header-left">
        <img src="/src/assets/logo_de_veterinaria.jpg" alt="Logo Veterinaria" class="app-logo">
        <span class="app-title">Veterinaria XYZ</span>
      </div>
      <div class="header-right">
        <button class="btn btn-danger" @click="logout">
          Cerrar Sesión
        </button>
      </div>
    </header>

    <div class="pacientes-container">
      <div class="section-header">
        <h1>Gestión de Pacientes</h1>
        <div class="section-actions">
          <button class="btn btn-nuevo" @click="abrirNuevoPaciente">
            Nuevo Paciente
          </button>
          <button class="btn btn-secondary btn-icon" @click="exportarPacientes">
            <img src="@/assets/exportar.png" alt="Exportar" class="icon-img">
            <span class="btn-text">Exportar</span>
          </button>
          <button class="btn btn-secondary btn-icon" @click="importarPacientes">
            <img src="@/assets/importar.jpg" alt="Importar" class="icon-img">
            <span class="btn-text">Importar</span>
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Especie</th>
              <th>Raza</th>
              <th>Edad</th>
              <th>Propietario</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in paginatedPacientes" :key="paciente.id">
              <td data-label="Nombre:"><span>{{ paciente.nombre_mascota }}</span></td>
              <td data-label="Especie:"><span>{{ paciente.especie }}</span></td>
              <td data-label="Raza:"><span>{{ paciente.raza }}</span></td>
              <td data-label="Edad:"><span>{{ calcularEdad(paciente.fecha_nacimiento) }}</span></td>
              <td data-label="Propietario:"><span>{{ paciente.nombre_dueno }}</span></td>
              <td data-label="Teléfono:"><span>{{ paciente.telefono }}</span></td>
              <td data-label="Acciones:">
                <button class="btn btn-secondary" @click="editarPaciente(paciente)">
                  Editar
                </button>
                <button class="btn btn-danger" @click="eliminarPaciente(paciente.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination-controls-wrapper">
        <div class="pagination-controls">
          <button 
            class="btn btn-icon" 
            @click="goToPage(1)" 
            :disabled="currentPage === 1">
            &laquo;
          </button>
          <button 
            class="btn btn-icon" 
            @click="prevPage" 
            :disabled="currentPage === 1">
            &lt;
          </button>

          <button 
            v-for="page in displayedPages" 
            :key="page" 
            :class="['btn', 'btn-page', { 'active': page === currentPage, 'disabled': page === '...' }]"
            @click="page !== '...' && goToPage(page)"
            :disabled="page === '...'">
            {{ page }}
          </button>

          <button 
            class="btn btn-icon" 
            @click="nextPage" 
            :disabled="currentPage === totalPages">
            &gt;
          </button>
          <button 
            class="btn btn-icon" 
            @click="goToPage(totalPages)" 
            :disabled="currentPage === totalPages">
            &raquo;
          </button>
        </div>
      </div>

      <!-- Modal para crear/editar paciente -->
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ pacienteSeleccionado ? 'Editar Paciente' : 'Registrar un nuevo paciente' }}</h2>
            <button class="close-button" @click="showModal = false">&times;</button>
          </div>
          <form @submit.prevent="guardarPaciente">
            <div class="form-group">
              <label for="nombre_mascota">Nombre de la Mascota</label>
              <input 
                type="text" 
                id="nombre_mascota" 
                v-model="form.nombre_mascota" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="especie">Especie</label>
              <input 
                type="text" 
                id="especie" 
                v-model="form.especie" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="raza">Raza</label>
              <input 
                type="text" 
                id="raza" 
                v-model="form.raza" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="fecha_nacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fecha_nacimiento"
                v-model="form.fecha_nacimiento"
                required
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="tipo_identificacion_dueno">T.Identificación Propietario</label>
              <select 
                id="tipo_identificacion_dueno" 
                v-model="form.tipo_identificacion_dueno" 
                required
                class="form-control"
              >
                <option value="">Seleccione</option>
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="PASAPORTE">PASAPORTE</option>
              </select>
            </div>
            <div class="form-group">
              <label for="identificacion_dueno">Identificación Propietario</label>
              <input 
                type="text" 
                id="identificacion_dueno" 
                v-model="form.identificacion_dueno" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="nombre_dueno">Nombre del Propietario</label>
              <input 
                type="text" 
                id="nombre_dueno" 
                v-model="form.nombre_dueno" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="ciudad">Ciudad</label>
              <input 
                type="text" 
                id="ciudad" 
                v-model="form.ciudad" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="telefono">Teléfono</label>
              <input 
                type="tel" 
                id="telefono" 
                v-model="form.telefono" 
                required
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label for="direccion">Dirección</label>
              <input 
                type="text" 
                id="direccion" 
                v-model="form.direccion" 
                required
                class="form-control"
              >
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">
                {{ pacienteSeleccionado ? 'Actualizar' : 'Registrar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Input oculto para importar archivo -->
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        accept=".xlsx,.xls"
        @change="handleFileUpload"
      >
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { pacientesService } from '../services/pacientesService';
import { authService } from '../services/authService';
import '../styles/pacientes.css';
import { usePacientes } from '../composables/usePacientes';

export default {
  name: 'PacientesView',
  setup() {
    const { 
      pacientes,
      showModal,
      pacienteSeleccionado,
      form,
      fileInput,
      editarPaciente,
      eliminarPaciente,
      guardarPaciente,
      exportarPacientes,
      importarPacientes,
      handleFileUpload,
      calcularEdad,
      logout,
      resetForm,
      // Paginación
      currentPage,
      itemsPerPage,
      paginatedPacientes,
      totalPages,
      nextPage,
      prevPage,
      goToPage,
      displayedPages
    } = usePacientes();

    // Función para abrir el modal de nuevo paciente y limpiar el formulario
    const abrirNuevoPaciente = () => {
      resetForm();
      showModal.value = true;
    };

    return {
      pacientes,
      showModal,
      pacienteSeleccionado,
      form,
      fileInput,
      editarPaciente,
      eliminarPaciente,
      guardarPaciente,
      exportarPacientes,
      importarPacientes,
      handleFileUpload,
      calcularEdad,
      logout,
      abrirNuevoPaciente,
      // Paginación
      currentPage,
      itemsPerPage,
      paginatedPacientes,
      totalPages,
      nextPage,
      prevPage,
      goToPage,
      displayedPages
    };
  }
};
</script>