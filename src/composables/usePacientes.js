import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { pacientesService } from '../services/pacientesService';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';

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
        fecha_nacimiento: null,
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
            fecha_nacimiento: paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento) : null,
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
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el paciente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await pacientesService.deletePaciente(id);
                await cargarPacientes();
                await Swal.fire('Eliminado', 'Paciente eliminado exitosamente', 'success');
            } catch (error) {
                await Swal.fire('Error', 'Error al eliminar el paciente', 'error');
            }
        }
    };

    const guardarPaciente = async () => {
        try {
            let fechaFormateada = form.value.fecha_nacimiento;
            if (fechaFormateada instanceof Date) {
                const year = fechaFormateada.getFullYear();
                const month = String(fechaFormateada.getMonth() + 1).padStart(2, '0');
                const day = String(fechaFormateada.getDate()).padStart(2, '0');
                fechaFormateada = `${year}-${month}-${day}`;
            }
            const payload = { ...form.value, fecha_nacimiento: fechaFormateada };
            if (pacienteSeleccionado.value) {
                const detalles = `
Identificación: ${form.value.identificacion_dueno}
Tipo Identificación: ${form.value.tipo_identificacion_dueno}
Nombre Mascota: ${form.value.nombre_mascota}
Especie: ${form.value.especie}
Raza: ${form.value.raza}
Fecha Nacimiento: ${fechaFormateada}
Nombre Dueño: ${form.value.nombre_dueno}
Ciudad: ${form.value.ciudad}
Dirección: ${form.value.direccion}
Teléfono: ${form.value.telefono}
`;
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    html: `<b>¿Deseas actualizar la información de este paciente?</b><br><pre style='text-align:left'>${detalles}</pre>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Actualizar',
                    cancelButtonText: 'Cancelar',
                    focusCancel: true
                });

                if (!result.isConfirmed) {
                    return;
                }

                await pacientesService.updatePaciente(payload);
                await Swal.fire('Actualizado', 'Paciente actualizado exitosamente', 'success');
            } else {
                const detalles = `
Identificación: ${form.value.identificacion_dueno}
Tipo Identificación: ${form.value.tipo_identificacion_dueno}
Nombre Mascota: ${form.value.nombre_mascota}
Especie: ${form.value.especie}
Raza: ${form.value.raza}
Fecha Nacimiento: ${fechaFormateada}
Nombre Dueño: ${form.value.nombre_dueno}
Ciudad: ${form.value.ciudad}
Dirección: ${form.value.direccion}
Teléfono: ${form.value.telefono}
`;
                const result = await Swal.fire({
                    title: '¿Estás seguro?',
                    html: `<b>¿Deseas registrar este paciente?</b><br><pre style='text-align:left'>${detalles}</pre>`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Registrar',
                    cancelButtonText: 'Cancelar',
                    focusCancel: true
                });
                if (!result.isConfirmed) {
                    return;
                }
                const nuevoPaciente = await pacientesService.createPaciente(payload);
                await Swal.fire('Guardado', 'Paciente guardado exitosamente', 'success');
                if (nuevoPaciente && nuevoPaciente.id) {
                    pacientes.value.unshift(nuevoPaciente);
                } else {
                    await cargarPacientes();
                }
            }
            showModal.value = false;
            await cargarPacientes();
            resetForm();
        } catch (error) {
            await Swal.fire('Error', 'Error al guardar el paciente', 'error');
        }
    };

    const exportarPacientes = async () => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea exportar sus datos?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Exportar',
            cancelButtonText: 'Cancelar',
            focusCancel: true
        });
        if (!result.isConfirmed) {
            return;
        }
        try {
            const blob = await pacientesService.exportarPacientes();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'pacientes.xlsx');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Pacientes exportados exitosamente',
                timer: 1800,
                showConfirmButton: false
            });
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al exportar los pacientes',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const importarPacientes = async () => {
        const result = await Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea importar datos? Esto puede sobrescribir información existente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Importar',
            cancelButtonText: 'Cancelar',
            focusCancel: true
        });
        if (!result.isConfirmed) {
            return;
        }
        fileInput.value.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await pacientesService.importarPacientes(file);
                await cargarPacientes();
                await Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Pacientes importados exitosamente',
                    timer: 1800,
                    showConfirmButton: false
                });
            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al importar los pacientes',
                    timer: 2000,
                    showConfirmButton: false
                });
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
            fecha_nacimiento: null,
            tipo_identificacion_dueno: '',
            identificacion_dueno: '',
            nombre_dueno: '',
            ciudad: '',
            direccion: '',
            telefono: ''
        };
        pacienteSeleccionado.value = null;
    };

    const logout = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cerrar esta sesión?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            authService.logout();
            router.push('/login');
        }
    };

    onMounted(() => {
        if (authService.isAuthenticated()) {
            cargarPacientes();
        }
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