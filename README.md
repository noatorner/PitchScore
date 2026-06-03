# Kancha

Kanch es un prototipo de juego inspirado en el Mundial 2026 donde cada usuario reserva zonas de un campo de futbol y gana puntos segun lo que pase en esas zonas durante un partido real.

Esta version ya no es solo una demo visual. Introduce mercado, presupuesto, un campo normalizado por coordenadas, fixture real inicial del Mundial 2026 y desglose de resultados por propietario.

## Que incluye ahora

- Campo completo dividido en una malla de `30 x 20` micro-celdas.
- Macrozonas calculadas geometricamente y alineadas con las lineas del campo: porteria, area pequena, area, punto de penalti, punto de saque, zona caliente frontal, corners, bandas, half-spaces, circulo central, carril central y salida.
- Panel lateral de seleccion para entender mejor cada activo al clicar.
- Coste de reserva por tipo de celda, tier y peso tactico.
- Jugadores con presupuesto inicial configurable.
- Sistema de acceso local por jugador.
- Compra de activos desde el panel lateral con control de presupuesto.
- Activos premium dibujados como bloques unicos: porteria, punto de penalti, punto de saque y corners.
- Fixture real inicial del Mundial 2026 cargado con partidos oficiales.
- Registro manual de eventos del partido.
- Clasificacion neta por jugador.
- Desglose de valor por propiedad y por acto.
- Persistencia local con `localStorage`.

## Modelo actual de juego

Cada celda tiene:

- `macroZone`: tipo de activo tactico.
- `entryCost`: coste de compra o reserva.
- `tier`: nivel de valor del activo.
- `weight`: importancia relativa.
- `eventScores`: acciones que puntuan dentro de esa division.
- `x/y`: coordenadas de campo normalizadas.

La puntuacion actual sigue esta formula:

- Cada reserva descuenta `entryCost / 10` como coste de entrada.
- Cada evento real suma los puntos definidos en la zona donde ocurre.
- El ranking se ordena por `puntos brutos - coste de reserva`.

## Flujo de uso

1. Seleccionar partido y presupuesto de ronda.
2. Crear jugadores.
3. Entrar como uno de los jugadores.
4. Comprar activos desde el panel lateral al clicar en el campo.
5. Registrar eventos reales del partido en la celda correspondiente.
6. Consultar clasificacion y detalle por propiedad.

## Proximos pasos recomendados

1. Conectar una fuente de eventos en directo con coordenadas `x/y`.
2. Mapear automaticamente cada evento recibido a una celda y macrozona.
3. Definir reglas de reventa, bloqueo de mercado y rondas cerradas.
4. Cargar el fixture completo y sincronizarlo con una API real de eventos de futbol.
5. Guardar partidas en backend y permitir ligas privadas.
