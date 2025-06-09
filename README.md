
# Herramienta de Visualización de Votaciones (Formato Hemiciclo)

Este proyecto, desarrollado con el framework React, ofrece una visualización interactiva en formato de hemiciclo para representar los resultados de votaciones llevadas a cabo en **órganos colegiados de decisión**, como cámaras legislativas, organismos internacionales, tribunales, partidos políticos o asambleas religiosas.

Su propósito es **facilitar el análisis y la comprensión de los resultados de una votación**, fomentando la **transparencia** y permitiendo observar la información desde distintas perspectivas.

Como ejemplo de uso y personalización, se ha tomado la votación del proyecto de ley de Ficha Limpia, debatido tanto en la Cámara de Diputados como en la de Senadores del Congreso de la República Argentina.

# Herramienta de Visualización de Votaciones (Formato Hemiciclo)

🔗 **Live Demo:**  
[https://voting-hemicycle-widget.vercel.app](https://voting-hemicycle-widget.vercel.app)

## 🔍 Características principales

La visualización ofrece **tres formas distintas de explorar los datos**:

1. **Por tipo de voto**  
   Muestra la aprobación o rechazo, clasificando los votos en sus diferentes tipos (afirmativos, negativos, abstenciones, ausentes, etc.).

2. **Por bloque**  
   Agrupa los votos según el bloque u orientación a la que pertenece cada votante, mostrando su comportamiento colectivo e individual.

3. **Vista individual por votante**  
   Permite conocer más información del votante, con foco en la información individual si se encuentra disponible.

Está especialmente pensada para apuntar a un enfoque visual y accesible frente a textos extensos o poco claros sobre los resultados de distintos tipos de votaciones.

> 📝 **Nota:**  
> El proyecto está preparado para visualizar tanto los resultados de la **Cámara de Diputados** como los de la **Cámara de Senadores**, si ambos se encuentran disponibles.  
>  
> Dado que el tratamiento legislativo suele iniciar en Diputados y luego pasar a Senadores, es posible que, en determinadas etapas, los datos de Senadores aún no estén cargados.  
> En ese caso, la visualización lo indicará claramente mediante una leyenda informativa, permitiendo al usuario saber que la votación de esa cámara todavía no fue registrada o publicada.

## 🚀 Instalación y uso

1. Cloná el repositorio:

   ```bash
   git clone https://github.com/DiFioreSantiago/voting-hemicycle-widget
   ```

2. Instalá las dependencias:

   ```bash
   npm install
   ```

3. Ejecutá el proyecto:

   ```bash
   npm run dev
   ```

### 🔁 Alternativa local  
Aunque los datos se cargan dinámicamente mediante `fetch`, con fines de prueba los archivos también pueden colocarse localmente dentro del proyecto, en la carpeta `src/components/Hemicycle`.  
Esto permite previsualizar otros resultados de votación sin necesidad de volver a desplegar la API.

Para ello, se deben incluir los siguientes archivos:

- `votacionDiputados.json`: contiene el detalle de los votos por diputado (nombre, bloque, provincia, tipo de voto, foto).
- `votacionSenadores.json`: contiene el detalle de los votos por senador (nombre, bloque, provincia, tipo de voto, foto).
- `mockResults.json`: contiene los totales por tipo de voto y por partido para ambas cámaras (Diputados y Senadores).

Este proyecto también incluye imágenes de diputados y senadores para ilustrar las capacidades del sistema. Estas imágenes pueden ser desactivadas desde el código o reemplazadas por otras, como banderas o íconos representativos, por ejemplo en visualizaciones de organismos internacionales como la ONU.

Las imágenes originales pueden obtenerse desde los sitios oficiales de la  
[Honorable Cámara de Diputados de la Nación](https://votaciones.hcdn.gob.ar/) y la  
[Honorable Cámara de Senadores de la Nación](https://www.senado.gob.ar/votaciones/actas).

> Los archivos `mockResults.json`, `votacionDiputados.json` y `votacionSenadores.json` pueden generarse automáticamente mediante el script en Python disponible en este repositorio:  
> [Script para generar resultados](https://github.com/DiFioreSantiago/script-hemicycle-data)


## 🧠 ¿Cómo se usa?

- Alterná entre las vistas usando las pestañas ubicadas por encima del hemiciclo.
- Posicioná el cursor sobre un punto del hemiciclo para ver un **tooltip** con la información del diputado.
- En el centro del hemiciclo se muestra el **total de votos** del tipo o bloque correspondiente.
- Debajo del hemiciclo hay secciones desplegables con más detalles (por ejemplo, el detalle de los votantes cuyo voto fue afirmativo).
- El título del proyecto, para testear otros proyectos de ley, puede modificarse desde el componente `Header`.
- Incluye **modo oscuro**, activable mediante un switch o mediante parámetros de la URL.
- Puede ser **embebido** en otras páginas usando `<iframe>`, gracias a que se configuraron las vistas y el modo de tema mediante parámetros de la URL.

**Los datos se cargan dinámicamente desde la API:**  
→ https://api-hemicycle-widget.onrender.com

Estos archivos están desplegados en el repositorio:  
→ [Datos y API](https://github.com/DiFioreSantiago/api-hemicycle-widget)

### 🎛️ Parámetros de configuración

La visualización permite configurarse mediante **parámetros en la URL**:

| Parámetro            | Descripción                                                  |
|--------------------- |--------------------------------------------------------------|
| `hemiciclo=partidos` | Muestra los votos agrupados por partidos.                    |
| `hemiciclo=votos`    | Muestra los votos agrupados por tipos de voto.               |
| `theme=dark`         | Activa el modo oscuro.                                       |
| `theme=light`        | Activa el modo claro.                                        |
| `camara=diputados`   | Visualiza la votación de la Cámara de Diputados.             |
| `camara=senadores`   | Visualiza la votación de la Cámara de Senadores.             |

## Referencias y proyectos base

Este proyecto toma inspiración y fundamentos conceptuales de los siguientes repositorios, a quienes se agradece por su trabajo y por compartir sus desarrollos de manera abierta:

- [parliament-svg](https://github.com/juliuste/parliament-svg) – Biblioteca SVG para visualización de parlamentos semicirculares.
- [westminster-svg](https://github.com/juliuste/westminster-svg) – Variante para representación del Parlamento británico.
- [d3-parliament](https://github.com/geoffreybr/d3-parliament) – Visualización parlamentaria interactiva con D3.js.
- [wikidata-parliament-svg](https://github.com/k-nut/wikidata-parliament-svg) – Generador de visualizaciones parlamentarias basado en datos de Wikidata.

## 🤝 Contribuciones

¡Estás invitado/a a colaborar!

Si querés mejorar el proyecto, proponer ideas o reportar errores, podés abrir un issue o enviar un pull request.

## 🛡️ Licencia

Este proyecto está bajo la Licencia MIT.  
Esto significa que podés usar, copiar, modificar y distribuir el código, incluso con fines comerciales, siempre que mantengas este aviso de derechos de autor.
