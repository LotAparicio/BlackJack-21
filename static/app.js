const STORAGE_KEY = "blackjack21_avisos_simulados_v1";

const DEFAULT_AVISOS = [
  {
    folio: "AV-101",
    area: "Servicios Escolares",
    tipo: "Normal",
    titulo: "Asambleas informativas Beca Jóvenes Escribiendo el Futuro 2026-2",
    fecha: "2026-11-26",
    lugar: "Auditorio del Tecnológico de Matehuala",
    enlace: "https://matehuala.tecnm.mx/becas-jef",
    cuerpo: "Se convoca a estudiantes interesados a la sesión informativa. Fecha: 2026-11-26 | Lugar: Auditorio del Tecnológico de Matehuala | Enlace: https://matehuala.tecnm.mx/becas-jef",
    estado: "Publicado / Programado",
    detalle: "Programado para difusión en canal de prueba (RN-04)."
  },
  {
    folio: "AV-102",
    area: "Gestión Tecnológica y Vinculación",
    tipo: "Normal",
    titulo: "Cierre de recepción de solicitudes de servicio social",
    fecha: "2026-11-25",
    lugar: "Departamento de Gestión Tecnológica y Vinculación",
    enlace: "https://matehuala.tecnm.mx/servicio-social",
    cuerpo: "Último día para entregar documentación de servicio social. Fecha límite: 2026-11-25 | Lugar: Departamento de Gestión Tecnológica y Vinculación | Enlace: https://matehuala.tecnm.mx/servicio-social",
    estado: "En revisión",
    detalle: "Pendiente de validación editorial por Comunicación y Difusión."
  },
  {
    folio: "AV-103",
    area: "Dirección",
    tipo: "Urgente / Dirección",
    titulo: "Comunicado oficial de suspensión temporal de actividades",
    fecha: "2026-11-21",
    lugar: "Plantel TecNM Campus Matehuala",
    enlace: "https://matehuala.tecnm.mx/comunicados",
    cuerpo: "Comunicado oficial registrado con prioridad alta (RN-03). Fecha: 2026-11-21 | Lugar: Plantel TecNM Campus Matehuala | Enlace: https://matehuala.tecnm.mx/comunicados",
    estado: "Publicado / Programado",
    detalle: "Registrado directamente sin bloqueo de aprobación previa (RF-07 / RN-03)."
  }
];

function loadAvisos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_AVISOS));
      return [...DEFAULT_AVISOS];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_AVISOS];
  } catch (err) {
    return [...DEFAULT_AVISOS];
  }
}

function saveAvisos(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    // Si localStorage no está disponible, se mantiene en memoria durante la sesión
  }
}

let avisos = loadAvisos();

function calcAnticipacionDias(fechaStr) {
  if (!fechaStr) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [y, m, d] = fechaStr.split("-").map(Number);
  const objetivo = new Date(y, m - 1, d);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
}

function actualizarAlertaYVistaPrevia() {
  const tipo = document.getElementById("tipo-aviso").value;
  const titulo = document.getElementById("titulo-aviso").value.trim();
  const fecha = document.getElementById("fecha-evento").value;
  const lugar = document.getElementById("lugar-aviso").value.trim();
  const enlace = document.getElementById("enlace-aviso").value.trim();
  const cuerpo = document.getElementById("cuerpo-aviso").value.trim();

  const alertaBox = document.getElementById("alerta-anticipacion");
  const dias = calcAnticipacionDias(fecha);

  if (tipo === "Normal" && dias !== null && dias < 3) {
    alertaBox.classList.remove("hidden");
  } else {
    alertaBox.classList.add("hidden");
    document.getElementById("confirmar-anticipacion").checked = false;
  }

  const previewEl = document.getElementById("vista-previa-texto");
  if (!titulo && !cuerpo && !fecha && !lugar && !enlace) {
    previewEl.textContent = "Completa los campos del formulario para visualizar el texto estandarizado con fecha, lugar y enlace.";
    return;
  }

  const encabezado = titulo ? `${titulo.toUpperCase()}` : "AVISO INSTITUCIONAL";
  const textoBase = cuerpo || "Detalle del aviso institucional.";
  const lineaFecha = fecha ? `Fecha: ${fecha}` : "Fecha: por definir";
  const lineaLugar = lugar ? `Lugar: ${lugar}` : "Lugar: por definir";
  const lineaEnlace = enlace ? `Enlace: ${enlace}` : "Enlace: no especificado";

  previewEl.textContent = `${encabezado}
${textoBase}
${lineaFecha} | ${lineaLugar} | ${lineaEnlace}`;
}

function limpiarErrores() {
  ["err-area", "err-titulo", "err-fecha", "err-lugar", "err-enlace", "err-cuerpo", "err-anticipacion"].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
}

function validarFormulario() {
  limpiarErrores();
  let valido = true;

  const area = document.getElementById("area-solicitante").value.trim();
  const tipo = document.getElementById("tipo-aviso").value;
  const titulo = document.getElementById("titulo-aviso").value.trim();
  const fecha = document.getElementById("fecha-evento").value;
  const lugar = document.getElementById("lugar-aviso").value.trim();
  const enlace = document.getElementById("enlace-aviso").value.trim();
  const cuerpo = document.getElementById("cuerpo-aviso").value.trim();
  const confirmado = document.getElementById("confirmar-anticipacion").checked;

  if (!area) {
    document.getElementById("err-area").textContent = "Selecciona el área solicitante.";
    valido = false;
  }
  if (!titulo) {
    document.getElementById("err-titulo").textContent = "Ingresa el título del aviso.";
    valido = false;
  }
  if (!fecha) {
    document.getElementById("err-fecha").textContent = "Selecciona la fecha del evento o límite.";
    valido = false;
  }
  if (!lugar) {
    document.getElementById("err-lugar").textContent = "Indica el lugar o modalidad.";
    valido = false;
  }
  if (!enlace || !/^https?:\/\/.+/i.test(enlace)) {
    document.getElementById("err-enlace").textContent = "Ingresa un enlace válido que inicie con http:// o https://.";
    valido = false;
  }
  if (!cuerpo) {
    document.getElementById("err-cuerpo").textContent = "Captura el cuerpo del mensaje.";
    valido = false;
  }

  const dias = calcAnticipacionDias(fecha);
  if (tipo === "Normal" && dias !== null && dias < 3 && !confirmado) {
    document.getElementById("err-anticipacion").textContent = "Confirma la casilla de poca anticipación (< 3 días) para enviar.";
    valido = false;
  }

  return valido;
}

function generarFolio() {
  const num = 100 + avisos.length + 1;
  return `AV-${num}`;
}

function renderPendientes() {
  const cont = document.getElementById("lista-pendientes");
  const pendientes = avisos.filter((a) => a.estado === "En revisión");

  if (pendientes.length === 0) {
    cont.innerHTML = '<p class="muted">No hay solicitudes pendientes de revisión editorial en este momento.</p>';
    return;
  }

  cont.innerHTML = pendientes
    .map(
      (item) => `
      <article class="review-card" data-folio="${item.folio}">
        <div class="review-top">
          <strong>Folio ${item.folio} · ${item.area}</strong>
          <span class="status-pill status-revision">${item.estado}</span>
        </div>
        <p><strong>Título:</strong> ${escapeHtml(item.titulo)}</p>
        <p><strong>Fecha evento:</strong> ${escapeHtml(item.fecha)} | <strong>Lugar:</strong> ${escapeHtml(item.lugar)}</p>
        <div class="field-group">
          <label for="edit-cuerpo-${item.folio}">Texto a publicar (editable por Difusión · RF-03 / RF-05)</label>
          <textarea id="edit-cuerpo-${item.folio}" rows="3">${escapeHtml(item.cuerpo)}</textarea>
        </div>
        <div class="field-group">
          <label for="motivo-rechazo-${item.folio}">Motivo de rechazo (obligatorio solo si rechaza)</label>
          <input type="text" id="motivo-rechazo-${item.folio}" placeholder="Ej. Especificar horario o corregir enlace" />
        </div>
        <div class="review-actions">
          <button type="button" class="btn btn-approve" onclick="aprobarAviso('${item.folio}')">Aprobar y programar</button>
          <button type="button" class="btn btn-reject" onclick="rechazarAviso('${item.folio}')">Rechazar con motivo</button>
        </div>
      </article>
    `
    )
    .join("");
}

function aprobarAviso(folio) {
  const txtArea = document.getElementById(`edit-cuerpo-${folio}`);
  const idx = avisos.findIndex((a) => a.folio === folio);
  if (idx === -1) return;

  if (txtArea && txtArea.value.trim()) {
    avisos[idx].cuerpo = txtArea.value.trim();
  }
  avisos[idx].estado = "Publicado / Programado";
  avisos[idx].detalle = "Aprobado por Comunicación y Difusión para publicación en canal de prueba (RN-04).";
  saveAvisos(avisos);
  renderAll();
}

function rechazarAviso(folio) {
  const motivoInput = document.getElementById(`motivo-rechazo-${folio}`);
  const motivo = motivoInput ? motivoInput.value.trim() : "";
  if (!motivo) {
    alert("Debes indicar un motivo de rechazo antes de rechazar la solicitud (RF-03).");
    if (motivoInput) motivoInput.focus();
    return;
  }

  const idx = avisos.findIndex((a) => a.folio === folio);
  if (idx === -1) return;

  avisos[idx].estado = "Rechazado";
  avisos[idx].detalle = `Motivo: ${motivo}`;
  saveAvisos(avisos);
  renderAll();
}

function renderSeguimiento() {
  const estadoFiltro = document.getElementById("filtro-estado").value;
  const textoFiltro = document.getElementById("filtro-busqueda").value.trim().toLowerCase();

  const total = avisos.length;
  const aprobados = avisos.filter((a) => a.estado === "Publicado / Programado").length;
  const enRevision = avisos.filter((a) => a.estado === "En revisión").length;
  const rechazados = avisos.filter((a) => a.estado === "Rechazado").length;

  document.getElementById("resumen-metricas").innerHTML = `
    <div class="metric-tile"><strong>${total}</strong><span>Avisos registrados</span></div>
    <div class="metric-tile"><strong>${aprobados}</strong><span>Publicados / Programados</span></div>
    <div class="metric-tile"><strong>${enRevision}</strong><span>En revisión</span></div>
    <div class="metric-tile"><strong>${rechazados}</strong><span>Rechazados</span></div>
  `;

  const filtrados = avisos.filter((a) => {
    const matchEstado = estadoFiltro === "Todos" || a.estado === estadoFiltro;
    const matchTexto =
      !textoFiltro ||
      a.folio.toLowerCase().includes(textoFiltro) ||
      a.titulo.toLowerCase().includes(textoFiltro) ||
      a.area.toLowerCase().includes(textoFiltro);
    return matchEstado && matchTexto;
  });

  const tbody = document.getElementById("tabla-avisos-body");
  if (filtrados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Sin registros que coincidan con el filtro seleccionado.</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados
    .map((a) => {
      let pillClass = "status-revision";
      if (a.estado === "Publicado / Programado") pillClass = "status-publicado";
      if (a.estado === "Rechazado") pillClass = "status-rechazado";
      return `
        <tr>
          <td><strong>${escapeHtml(a.folio)}</strong></td>
          <td><strong>${escapeHtml(a.titulo)}</strong><br /><small>${escapeHtml(a.area)}</small></td>
          <td>${escapeHtml(a.fecha)}</td>
          <td>${escapeHtml(a.tipo)}</td>
          <td><span class="status-pill ${pillClass}">${escapeHtml(a.estado)}</span></td>
          <td>${escapeHtml(a.detalle)}</td>
        </tr>
      `;
    })
    .join("");
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderAll() {
  renderPendientes();
  renderSeguimiento();
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(`view-${btn.dataset.view}`);
    if (target) target.classList.add("active");
  });
});

["tipo-aviso", "titulo-aviso", "fecha-evento", "lugar-aviso", "enlace-aviso", "cuerpo-aviso"].forEach((id) => {
  document.getElementById(id).addEventListener("input", actualizarAlertaYVistaPrevia);
  document.getElementById(id).addEventListener("change", actualizarAlertaYVistaPrevia);
});

document.getElementById("btn-llenar-ejemplo").addEventListener("click", () => {
  const fechaFutura = new Date();
  fechaFutura.setDate(fechaFutura.getDate() + 5);
  const isoFecha = fechaFutura.toISOString().split("T")[0];

  document.getElementById("area-solicitante").value = "Subdirección de Planeación y Vinculación";
  document.getElementById("tipo-aviso").value = "Normal";
  document.getElementById("titulo-aviso").value = "Convocatoria de Residencias Profesionales Periodo 2027-1";
  document.getElementById("fecha-evento").value = isoFecha;
  document.getElementById("lugar-aviso").value = "Departamento de Gestión Tecnológica y Vinculación";
  document.getElementById("enlace-aviso").value = "https://matehuala.tecnm.mx/residencias";
  document.getElementById("cuerpo-aviso").value =
    `Registro abierto para residencias profesionales. Fecha límite: ${isoFecha} | Lugar: Departamento de Gestión Tecnológica y Vinculación | Enlace: https://matehuala.tecnm.mx/residencias`;
  actualizarAlertaYVistaPrevia();
});

document.getElementById("form-aviso").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const area = document.getElementById("area-solicitante").value.trim();
  const tipo = document.getElementById("tipo-aviso").value;
  const titulo = document.getElementById("titulo-aviso").value.trim();
  const fecha = document.getElementById("fecha-evento").value;
  const lugar = document.getElementById("lugar-aviso").value.trim();
  const enlace = document.getElementById("enlace-aviso").value.trim();
  const cuerpo = document.getElementById("cuerpo-aviso").value.trim();

  const esUrgente = tipo === "Urgente / Dirección";
  const nuevoAviso = {
    folio: generarFolio(),
    area,
    tipo,
    titulo,
    fecha,
    lugar,
    enlace,
    cuerpo,
    estado: esUrgente ? "Publicado / Programado" : "En revisión",
    detalle: esUrgente
      ? "Aviso urgente/Dirección registrado directamente (RF-07 / RN-03)."
      : "Enviado a la bandeja de Comunicación y Difusión para revisión editorial (RF-03)."
  };

  avisos.unshift(nuevoAviso);
  saveAvisos(avisos);
  renderAll();

  const feedback = document.getElementById("resultado-folio");
  feedback.classList.remove("hidden");
  feedback.innerHTML = `
    <strong>Solicitud registrada con folio ${escapeHtml(nuevoAviso.folio)}.</strong>
    Estado actual: <strong>${escapeHtml(nuevoAviso.estado)}</strong>.
    ${esUrgente ? "Registrado con prioridad directa (RN-03)." : "Disponible en la bandeja de Difusión para revisión."}
  `;
});

document.getElementById("btn-reset-demo").addEventListener("click", () => {
  avisos = [...DEFAULT_AVISOS];
  saveAvisos(avisos);
  renderAll();
  const feedback = document.getElementById("resultado-folio");
  feedback.classList.remove("hidden");
  feedback.textContent = "Datos simulados restablecidos al estado inicial de prueba.";
});

document.getElementById("filtro-estado").addEventListener("change", renderSeguimiento);
document.getElementById("filtro-busqueda").addEventListener("input", renderSeguimiento);

actualizarAlertaYVistaPrevia();
renderAll();
