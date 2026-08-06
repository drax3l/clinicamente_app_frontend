📑 Documento de Contexto de Integración Frontend-Backend (ClinicaMente)
Este documento contiene la especificación técnica completa y exacta de las APIs del backend Spring Boot 3 de ClinicaMente, diseñada como referencia técnica para el desarrollo del frontend (React Native / Expo).

📌 1. Información de Configuración Base
URL Base en Producción: https://clinicamente-ep5e.onrender.com
URL Base en Local: http://localhost:8080
Headers Obligatorios para Rutas Privadas:
http
Content-Type: application/json
Authorization: Bearer <TOKEN_JWT>
🔐 2. Clasificación de Rutas (Públicas vs. Privadas)
Método	Endpoint	Acceso	Rol Requerido	Descripción
POST	/auth/register	🌐 Público	Ninguno	Registro de nuevo usuario en el sistema.
POST	/auth/login	🌐 Público	Ninguno	Autenticación y obtención de Token JWT.
GET	/api/psicologos	🌐 Público	Ninguno	Listar todos los psicólogos.
GET	/api/psicologos/{id}	🌐 Público	Ninguno	Ver detalle y disponibilidad de un psicólogo.
POST	/api/psicologos/horarios	🔒 Privado	ROLE_PSICOLOGO	Registrar un nuevo horario de atención.
PUT	/api/psicologos/perfil/{idUsuario}	🔒 Privado	ROLE_PSICOLOGO	Actualizar perfil profesional del psicólogo.
POST	/api/citas	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Agendar una nueva cita médica.
GET	/api/citas/paciente/{idPaciente}	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Listar citas de un paciente.
GET	/api/citas/psicologo/{idPsicologo}	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Listar la agenda de un psicólogo.
PATCH	/api/citas/{id}/estado	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Cambiar el estado de una cita.
POST	/api/notas-clinicas	🔒 Privado	ROLE_PSICOLOGO	Crear nota médica y diagnóstico.
GET	/api/notas-clinicas/cita/{idCita}	🔒 Privado	ROLE_PSICOLOGO	Consultar nota clínica por ID de cita.
GET	/api/mensajes-chat/cita/{idCita}	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Historial de mensajes de chat por cita.
POST	/api/mensajes-chat	🔒 Privado	ROLE_PACIENTE, ROLE_PSICOLOGO	Enviar mensaje en el chat de una cita.
GET	/api/admin/psicologos/pendientes	🔒 Privado	ROLE_ADMIN	Listar psicólogos con verificación pendiente.
PATCH	/api/admin/psicologos/{idUsuario}/verificacion	🔒 Privado	ROLE_ADMIN	Aprobar o rechazar verificación de psicólogo.
🗺️ 3. Mapa Detallado de APIs y Contratos DTO (JSON)
🔑 Módulo 1: Autenticación (/auth)
1.1. Registro de Usuario (POST /auth/register)
Acceso: Público

Body de Petición (JSON):

json
{
  "nombre": "Carlos",
  "apePaterno": "Mendoza",
  "apeMaterno": "Ramos",
  "correo": "carlos.mendoza@example.com",
  "contrasena": "Password123!"
}
(Nota: apeMaterno es opcional; los demás campos son obligatorios).

Body de Respuesta (200 OK):

json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjYXJsb3MubWVuZG96YUBleGFtcGxlLmNvbSIs..."
}
1.2. Inicio de Sesión (POST /auth/login)
Acceso: Público

Body de Petición (JSON):

json
{
  "correo": "carlos.mendoza@example.com",
  "contrasena": "Password123!"
}
Body de Respuesta (200 OK):

json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjYXJsb3MubWVuZG96YUBleGFtcGxlLmNvbSIs..."
}
🩺 Módulo 2: Psicólogos (/api/psicologos)
2.1. Listar Psicólogos (GET /api/psicologos)
Acceso: Público
Body de Petición: Ninguno
Body de Respuesta (200 OK):
json
[
  {
    "idUsuario": 2,
    "nombre": "María",
    "apePaterno": "Lopez",
    "apeMaterno": "Gomez",
    "correo": "maria.lopez@clinicamente.com",
    "calificacion": 4.90,
    "mensajeBienvenida": "Especialista en Terapia Cognitivo Conductual.",
    "enlaceVideollamada": "https://meet.google.com/abc-defg-hij",
    "horarios": [
      {
        "idHorario": 1,
        "idUsuario": 2,
        "diaSemana": "LUNES",
        "horaInicio": "09:00:00",
        "horaFin": "13:00:00"
      }
    ]
  }
]
2.2. Ver Detalle de Psicólogo (GET /api/psicologos/{id})
Acceso: Público
Parámetros: id (Long, Path variable)
Body de Petición: Ninguno
Body de Respuesta (200 OK):
json
{
  "idUsuario": 2,
  "nombre": "María",
  "apePaterno": "Lopez",
  "apeMaterno": "Gomez",
  "correo": "maria.lopez@clinicamente.com",
  "calificacion": 4.90,
  "mensajeBienvenida": "Especialista en Terapia Cognitivo Conductual.",
  "enlaceVideollamada": "https://meet.google.com/abc-defg-hij",
  "horarios": [
    {
      "idHorario": 1,
      "idUsuario": 2,
      "diaSemana": "LUNES",
      "horaInicio": "09:00:00",
      "horaFin": "13:00:00"
    }
  ]
}
2.3. Registrar Horario de Atención (POST /api/psicologos/horarios)
Acceso: Privado (ROLE_PSICOLOGO)

Body de Petición (JSON):

json
{
  "idUsuario": 2,
  "diaSemana": "MARTES",
  "horaInicio": "14:00:00",
  "horaFin": "18:00:00"
}
Body de Respuesta (201 Created):

json
{
  "idHorario": 5,
  "idUsuario": 2,
  "diaSemana": "MARTES",
  "horaInicio": "14:00:00",
  "horaFin": "18:00:00"
}
2.4. Configurar Perfil Profesional (PUT /api/psicologos/perfil/{idUsuario})
Acceso: Privado (ROLE_PSICOLOGO)

Parámetros: idUsuario (Long, Path variable)

Body de Petición (JSON):

json
{
  "calificacion": 5.00,
  "mensajeBienvenida": "Atención especializada para adultos y jóvenes.",
  "enlaceVideollamada": "https://meet.google.com/xyz-uvwx-rst"
}
Body de Respuesta (200 OK): PsicologoResponseDto (misma estructura que el 2.2).

📅 Módulo 3: Citas Médicas (/api/citas)
3.1. Agendar Cita (POST /api/citas)
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)

Body de Petición (JSON):

json
{
  "idPaciente": 1,
  "idPsicologo": 2,
  "fechaCita": "2026-08-10",
  "horaInicioCita": "10:00:00",
  "horaFinCita": "11:00:00",
  "modalidadCita": "VIRTUAL"
}
Body de Respuesta (201 Created):

json
{
  "idCita": 10,
  "idPaciente": 1,
  "nombrePaciente": null,
  "idPsicologo": 2,
  "nombrePsicologo": null,
  "fechaCita": "2026-08-10",
  "horaInicioCita": "10:00:00",
  "horaFinCita": "11:00:00",
  "modalidadCita": "VIRTUAL",
  "estadoCita": "PENDIENTE"
}
3.2. Listar Citas de un Paciente (GET /api/citas/paciente/{idPaciente})
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)
Parámetros: idPaciente (Long, Path variable)
Body de Respuesta (200 OK): Lista de CitaResponseDto.
3.3. Listar Citas de un Psicólogo (GET /api/citas/psicologo/{idPsicologo})
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)
Parámetros: idPsicologo (Long, Path variable)
Body de Respuesta (200 OK): Lista de CitaResponseDto.
3.4. Cambiar Estado de Cita (PATCH /api/citas/{id}/estado)
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)

Parámetros: id (Long, ID de la cita)

Body de Petición (JSON):

json
{
  "estadoCita": "CONFIRMADA"
}
(Valores permitidos: "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA")

Body de Respuesta (200 OK): CitaResponseDto actualizado.

📝 Módulo 4: Notas Clínicas (/api/notas-clinicas)
4.1. Crear Nota Clínica (POST /api/notas-clinicas)
Acceso: Privado (ROLE_PSICOLOGO)

Body de Petición (JSON):

json
{
  "idCita": 10,
  "diagnosticoPrincipal": "F41.1 Trastorno de ansiedad generalizada",
  "contenido": "El paciente muestra buena evolución emocional tras las dinámicas conductuales."
}
Body de Respuesta (201 Created):

json
{
  "idNota": 4,
  "idCita": 10,
  "diagnosticoPrincipal": "F41.1 Trastorno de ansiedad generalizada",
  "contenido": "El paciente muestra buena evolución emocional tras las dinámicas conductuales."
}
4.2. Obtener Nota por ID de Cita (GET /api/notas-clinicas/cita/{idCita})
Acceso: Privado (ROLE_PSICOLOGO)
Parámetros: idCita (Long, Path variable)
Body de Respuesta (200 OK): NotaClinicaResponseDto.
💬 Módulo 5: Chat por Cita (/api/mensajes-chat)
5.1. Obtener Historial de Chat (GET /api/mensajes-chat/cita/{idCita})
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)
Parámetros: idCita (Long, Path variable)
Body de Respuesta (200 OK):
json
[
  {
    "idMensaje": 101,
    "idCita": 10,
    "idRemitente": 1,
    "tipoRemitente": "PACIENTE",
    "contenidoTexto": "Hola Doctora, estaré listo a la hora acordada.",
    "fechaHoraEnvio": "2026-08-10T09:55:00"
  }
]
5.2. Enviar Mensaje de Chat (POST /api/mensajes-chat)
Acceso: Privado (ROLE_PACIENTE o ROLE_PSICOLOGO)

Body de Petición (JSON):

json
{
  "idCita": 10,
  "idRemitente": 2,
  "tipoRemitente": "PSICOLOGO",
  "contenidoTexto": "Perfecto, te espero en el enlace de la videollamada."
}
Body de Respuesta (201 Created): MensajeChatResponseDto generado con la marca de tiempo exacta fechaHoraEnvio.

👑 Módulo 6: Administración (/api/admin/psicologos)
6.1. Listar Psicólogos Pendientes de Verificación (GET /api/admin/psicologos/pendientes)
Acceso: Privado (ROLE_ADMIN)
Body de Respuesta (200 OK):
json
[
  {
    "idUsuario": 3,
    "nombre": "Carlos",
    "apePaterno": "Mendoza",
    "apeMaterno": "Ramos",
    "correo": "carlos.mendoza@example.com",
    "calificacion": 0.00,
    "totalResenas": 0,
    "mensajeBienvenida": "Especialista en psicología de pareja.",
    "enlaceVideollamada": "https://meet.google.com/xyz-123",
    "perfilPublico": false,
    "estadoVerificacion": "pendiente"
  }
]
6.2. Aprobar o Rechazar Verificación (PATCH /api/admin/psicologos/{idUsuario}/verificacion)
Acceso: Privado (ROLE_ADMIN)

Parámetros: idUsuario (Long, Path variable)

Body de Petición (JSON):

json
{
  "estado": "aprobado"
}
(Valores permitidos: "pendiente", "aprobado", "rechazado")

Body de Respuesta (200 OK): PsicologoPendienteResponseDto actualizado (perfilPublico pasa automáticamente a true al ser aprobado).

🔷 4. Tipado Oficial en TypeScript (Copy-Paste para React Native)
Para asegurar un tipado estricto en el frontend sin errores de nombres de variables:

typescript
// ── Auth Types ──
export interface LoginRequest {
  correo: string;
  contrasena: string;
}
export interface RegisterRequest {
  nombre: string;
  apePaterno: string;
  apeMaterno?: string;
  correo: string;
  contrasena: string;
}
export interface AuthResponse {
  token: string;
}
// ── Psicólogo Types ──
export interface HorarioDisponibilidadDto {
  idHorario?: number;
  idUsuario: number;
  diaSemana: string; // e.g. "LUNES", "MARTES"
  horaInicio: string; // e.g. "09:00:00"
  horaFin: string; // e.g. "13:00:00"
}
export interface PerfilPsicologoRequestDto {
  calificacion?: number;
  mensajeBienvenida?: string;
  enlaceVideollamada?: string;
}
export interface PsicologoResponseDto {
  idUsuario: number;
  nombre?: string;
  apePaterno?: string;
  apeMaterno?: string;
  correo?: string;
  calificacion?: number;
  mensajeBienvenida?: string;
  enlaceVideollamada?: string;
  horarios?: HorarioDisponibilidadDto[];
}
// ── Cita Types ──
export interface CitaRequestDto {
  idPaciente: number;
  idPsicologo: number;
  fechaCita: string; // YYYY-MM-DD
  horaInicioCita: string; // HH:mm:ss
  horaFinCita: string; // HH:mm:ss
  modalidadCita: string; // "VIRTUAL" | "PRESENCIAL"
}
export interface CambiarEstadoCitaDto {
  estadoCita: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
}
export interface CitaResponseDto {
  idCita: number;
  idPaciente: number;
  nombrePaciente?: string;
  idPsicologo: number;
  nombrePsicologo?: string;
  fechaCita: string;
  horaInicioCita: string;
  horaFinCita: string;
  modalidadCita: string;
  estadoCita: string;
}
// ── Nota Clínica Types ──
export interface NotaClinicaRequestDto {
  idCita: number;
  diagnosticoPrincipal: string;
  contenido: string;
}
export interface NotaClinicaResponseDto {
  idNota: number;
  idCita: number;
  diagnosticoPrincipal: string;
  contenido: string;
}
// ── Chat Types ──
export interface MensajeChatRequestDto {
  idCita: number;
  idRemitente: number;
  tipoRemitente: 'PACIENTE' | 'PSICOLOGO';
  contenidoTexto: string;
}
export interface MensajeChatResponseDto {
  idMensaje: number;
  idCita: number;
  idRemitente: number;
  tipoRemitente: string;
  contenidoTexto: string;
  fechaHoraEnvio: string; // ISO DateTime
}
// ── Admin Types ──
export interface ActualizarEstadoVerificacionRequestDto {
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}
export interface PsicologoPendienteResponseDto {
  idUsuario: number;
  nombre?: string;
  apePaterno?: string;
  apeMaterno?: string;
  correo?: string;
  calificacion?: number;
  totalResenas?: number;
  mensajeBienvenida?: string;
  enlaceVideollamada?: string;
  perfilPublico?: boolean;
  estadoVerificacion: string;
}