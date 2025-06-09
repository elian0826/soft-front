import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { pacientesService } from '../services/pacientesService';
import { authService } from '../services/authService';

export function usePacientes() {
    const router = useRouter();
    const pacientes = ref([]);
    const showModal = ref(false);
    const pacienteSeleccionado = ref(null);
    const fileInput = ref(null);
    const form = ref({
        id: null,
        nombre_mascota: '',
        especie: '',
        raza: '',
        fecha_nacimiento: '',
        tipo_identificacion_dueno: '',
        identificacion_dueno: '',
        nombre_dueno: '',
        ciudad: '',
        direccion: '',
        telefono: ''
    });
    const telefono = ref('');


    const currentPage = ref(1);
    const itemsPerPage = ref(6); 

    const paginatedPacientes = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return pacientes.value.slice(start, end);
    });

    const totalPages = computed(() => {
        return Math.ceil(pacientes.value.length / itemsPerPage.value);
    });

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const displayedPages = computed(() => {
        const pages = [];
        const maxVisiblePages = 5;
        const half = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage.value - half);
        let endPage = Math.min(totalPages.value, currentPage.value + half);

        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages.value, maxVisiblePages);
            } else if (endPage === totalPages.value) {
                startPage = Math.max(1, totalPages.value - maxVisiblePages + 1);
            }
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages.value) {
            if (endPage < totalPages.value - 1) {
                pages.push('...');
            }
            pages.push(totalPages.value);
        }

        return pages;
    });

    const cargarPacientes = async () => {
        try {
            const response = await pacientesService.getAllPacientes();
            if (response && response.data) {
                pacientes.value = response.data;
            }
        } catch (error) {
            alert('Error al cargar los pacientes');
        }
    };

    const editarPaciente = (paciente) => {
        pacienteSeleccionado.value = paciente;
        form.value = {
            id: paciente.id,
            nombre_mascota: paciente.nombre_mascota,
            especie: paciente.especie,
            raza: paciente.raza,
            fecha_nacimiento: paciente.fecha_nacimiento,
            tipo_identificacion_dueno: paciente.tipo_identificacion_dueno,
            identificacion_dueno: paciente.identificacion_dueno,
            nombre_dueno: paciente.nombre_dueno,
            ciudad: paciente.ciudad,
            direccion: paciente.direccion,
            telefono: paciente.telefono
        };
        showModal.value = true;
    };

    const eliminarPaciente = async (id) => {
        if (confirm('¿Está seguro de eliminar este paciente?')) {
            try {
                await pacientesService.deletePaciente(id);
                await cargarPacientes();
                alert('Paciente eliminado exitosamente');
            } catch (error) {
                alert('Error al eliminar el paciente');
            }
        }
    };

    const guardarPaciente = async () => {
        try {
            if (pacienteSeleccionado.value) {
                await pacientesService.updatePaciente(form.value);
            } else {
                await pacientesService.createPaciente(form.value);
            }
            showModal.value = false;
            await cargarPacientes();
            alert('Paciente guardado exitosamente');
            resetForm();
        } catch (error) {
            alert('Error al guardar el paciente');
        }
    };

    const exportarPacientes = async () => {
        try {
            const blob = await pacientesService.exportarPacientes();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'pacientes.xlsx');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            alert('Pacientes exportados exitosamente');
        } catch (error) {
            alert('Error al exportar los pacientes');
        }
    };

    const importarPacientes = () => {
        fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await pacientesService.importarPacientes(file);
                await cargarPacientes();
                alert('Pacientes importados exitosamente');
            } catch (error) {
                alert('Error al importar los pacientes');
            }
        }
    };

    const calcularEdad = (fechaNacimientoString) => {
        if (!fechaNacimientoString) return 'N/A';
        const hoy = new Date();
        const [year, month, day] = fechaNacimientoString.split('-').map(Number);
        const nacimiento = new Date(year, month - 1, day);
        
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return `${edad} años`;
    };

    const resetForm = () => {
        form.value = {
            id: null,
            nombre_mascota: '',
            especie: '',
            raza: '',
            fecha_nacimiento: '',
            tipo_identificacion_dueno: '',
            identificacion_dueno: '',
            nombre_dueno: '',
            ciudad: '',
            direccion: '',
            telefono: ''
        };
        pacienteSeleccionado.value = null;
    };

    const logout = () => {
        authService.logout();
        router.push('/login');
    };

    onMounted(() => {
        cargarPacientes();
    });

    return {
        pacientes,
        showModal,
        pacienteSeleccionado,
        form,
        fileInput,
        cargarPacientes,
        editarPaciente,
        eliminarPaciente,
        guardarPaciente,
        exportarPacientes,
        importarPacientes,
        handleFileUpload,
        calcularEdad,
        logout,
        resetForm,
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