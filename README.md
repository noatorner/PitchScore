# PitchScore

Juego/prototipo inspirado en el Mundial 2026 donde los usuarios reservan zonas de un campo de futbol y suman puntos segun lo que ocurre en esas zonas durante un partido real.

Esta primera version sirve como base de producto y validacion de mecanica.

## Que incluye esta primera version

- Divisiones base del terreno con valor de entrada distinto.
- Sistema de reserva por zona.
- Catalogo inicial de acciones puntuables segun la zona.
- Ranking automatico por usuario.
- Demo local para validar la mecanica.

## Modelo inicial

Las zonas incluidas ahora mismo son:

- Porteria
- Area pequena
- Punto de penalti
- Area
- Circulo del area
- Circulo central
- Zona amplia 1
- Zona amplia 2
- Corner izquierdo
- Corner derecho

Cada zona tiene:

- `entryCost`: coste de reserva
- `weight`: importancia relativa
- `eventScores`: acciones reales que dan puntos en esa zona

La puntuacion actual usa una regla simple:

- Reservar una zona descuenta `entryCost / 10` como coste de entrada.
- Cada evento real suma los puntos definidos para esa zona.

## Como abrirlo

Abre [index.html](C:/Users/ntorner/Documents/Codex/2026-04-23-vamos-a-construir-una-app-relacionada/index.html) en el navegador.

## Siguientes pasos recomendados

1. Definir el mapa exacto del campo con mas granularidad por filas y columnas.
2. Separar reglas por tipo de competicion o partido del Mundial 2026.
3. Conectar la app a una fuente real de eventos.
4. Añadir autenticacion, persistencia y marketplace de reservas.
