# BlackJack-21 · Gestión de Avisos Institucionales (TecNM Campus Matehuala)

Aplicación web en **HTML5 + CSS3 + JavaScript** con servidor local opcional en **Flask** (`app.py`), lista para publicarse directamente en **GitHub Pages** sin requerir descargas ni instalación de base de datos por parte del revisor.

## ¿Dónde se guardan los datos?
- **En el navegador (`localStorage`):** En la versión web HTML (`index.html` + `static/app.js`), los avisos creados, aprobados o rechazados durante la prueba se almacenan localmente en el `localStorage` del navegador del usuario que abre la página.
- **Datos simulados (RNF-06 / RN-04):** Todo el catálogo inicial y las pruebas operan exclusivamente con datos ficticios y de prueba, sin almacenar datos personales reales de estudiantes.
- **Persistencia en servidor (opcional con Flask):** Si ejecutas `python app.py` (`http://127.0.0.1:5000`), Flask sirve la interfaz HTML desde el servidor local.

## Uso rápido
1. **En la nube (GitHub Pages):** Habilita GitHub Pages en la rama `main` (`/` root) y abre la URL `https://lotaparicio.github.io/BlackJack-21/`.
2. **En local con Python/Flask:**
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
   Luego abre `http://127.0.0.1:5000`.
