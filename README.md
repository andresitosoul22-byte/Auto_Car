# AutoCar — Plataforma de alquiler 

Proyecto del taller **“Una historia de diseño con patrones creacionales”**: inventario de vehículos eléctricos/híbridos y contratos de alquiler con accesorios opcionales.

## Stack

- **Backend:** Java 17, Spring Boot (`backend/`)
- **Frontend:** React, Tailwind CSS (`frontend/`)
- **Persistencia:** sin base de datos por ahora; en el navegador se usa `localStorage`. El backend mantiene el inventario **en memoria** al ejecutar la aplicación (no se arranca H2/JPA hasta que lo integren).

## Cómo ejecutar el proyecto

### Backend

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Por defecto escucha en **http://localhost:8080**. CORS está permitido para **http://localhost:3000**.

### Frontend

```bash
cd frontend
npm install
npm start
```

Abre **http://localhost:3000**. Las vistas **Área cliente** y **Administración** permiten crear contratos y gestionar el inventario local; si el backend está arriba, las operaciones también intentan sincronizarse con la API.

### Variable opcional (API)

Si el frontend no corre en el mismo host/puerto, puedes definir:

```bash
set REACT_APP_API_URL=http://localhost:8080
npm start
```

## API REST (referencia)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/vehiculos` | Lista del inventario. Query: `ordenarPorAutonomia=true` para ordenar por autonomía (km). |
| `GET` | `/vehiculos/placa/{placa}` | Busca un vehículo por placa. |
| `POST` | `/vehiculos` | Crea y agrega un vehículo. Cuerpo JSON: `tipo` (`auto`, `van`, `camion`), `placa`, `autonomia`. Responde **409** si la placa ya existe en el inventario del servidor. |
| `POST` | `/contratos` | Crea un contrato vía *Builder*. Cuerpo: `clienteNombre`, `clienteDocumento`, `placaVehiculo`, `plan`, `diasAlquiler`, `gps`, `seguro`, `cargador`. Ante validación del builder, **400** con JSON `{ "error": "..." }`. |

El vehículo debe existir ya en el **inventario del servidor** para que `POST /contratos` responda bien (en el navegador el catálogo puede existir solo en `localStorage`).

---

## Actividad del taller — Qué implementamos

1. **Clases principales en Java:** modelo de vehículos (`Vehiculo` y subclases), `Cliente`, `Contrato`, inventario sobre **arreglo**, fábrica de vehículos y *builder* de contratos, servicios y controladores REST.
2. **Inventario con arreglo de objetos:** clase `Inventario` con capacidad fija; operaciones **agregar**, **buscar por placa** y **ordenar por autonomía** (ordenamiento en el arreglo). No se usa una lista dinámica como estructura principal del inventario.
3. **Interfaz:** rol **cliente** (contratos) y **administración** (inventario), con datos locales hasta integrar base de datos.

---

## Justificación de patrones creacionales

### Escenario 1 — Inventario de vehículos (Factory Method frente a Prototype)

**Decisión:** se usa una **fábrica centralizada** (`FabricaVehiculo`) que recibe un tipo simbólico (`auto`, `van`, `camion`) y devuelve la subclase concreta correspondiente.

**Por qué encaja con Factory Method:** el código que pide un vehículo (por ejemplo el controlador) **no instancia** `new Auto(...)`, `new Van(...)` ni ramas repetidas de lógica en la capa HTTP; delega en un único punto de creación. Extender el sistema con un nuevo tipo implica añadir subclase + un caso en la fábrica, en lugar de dispersar condicionales.

**Por qué no Prototype (en este contexto):** *Prototype* brilla cuando hay **plantillas registradas** que se **clonan** y solo se personalizan datos (p. ej. placa). Aquí el enunciado enfatiza **tipos distintos** de vehículo creados bajo demanda; la fábrica por tipo es directa y legible. *Prototype* seguiría siendo válido si el equipo decidiera mantener prototipos base (“auto urbano estándar”) en un registro y clonarlos.

**Ventajas de la elección:** bajo acoplamiento entre “quien pide” y “qué clase concreta existe”; menos duplicación de lógica de construcción.

**Limitaciones:** al seguir usando un `switch` (o mapa) en la fábrica, cada **nuevo tipo** exige **modificar** esa fábrica (no cumple el principio abierto/cerrado al 100% sin otro nivel de extensión, p. ej. registro de estrategias).

### Escenario 2 — Contratos de alquiler (Builder frente a Abstract Factory)

**Decisión:** se usa el patrón **Builder** (`ContratoBuilder`) para armar el contrato con datos obligatorios (cliente, vehículo, plan, duración) y **accesorios opcionales** (GPS, seguro, cargador) en pasos explícitos.

**Por qué encaja con Builder:** permite **validar** antes de entregar el objeto final (por ejemplo duración &gt; 0, plan no vacío) y aplicar reglas de negocio en un solo lugar, como el descuento si la duración es **mayor a 30 días** (en código: porcentaje configurable en el *builder*).

**Por qué no Abstract Factory (como opción principal):** *Abstract Factory* agrupa **familias** de productos que deben ser coherentes entre sí (p. ej. planes y accesorios según “kit Particular” vs “kit Empresarial”). El enunciado del taller no exige esas **familias cerradas** ni prohibir combinaciones entre kits; el problema es **construcción progresiva + validación**. Para “familias” estrictas, Abstract Factory sería una alternativa defendible.

**Ventajas:** evita constructores con muchos parámetros booleanos; estados intermedios inválidos no se exponen como `Contrato` terminado si `build()` valida.

**Limitaciones:** más clases/métodos que un POJO simple; para reglas muy complejas puede crecer el *builder* si no se extraen políticas a otras clases.

---

## Gestión del inventario con arreglo

- El inventario se representa como **`Vehiculo[]`** con un contador lógico de elementos ocupados.
- **Ventajas:** modelo alineado con el enunciado; acceso por índice; ordenamiento in-place.
- **Limitaciones:** **capacidad fija**; si se llena el arreglo, no se pueden agregar más vehículos sin redimensionar (en otra capa) o rechazar altas.

---

## Autores / curso

Completar con nombres del grupo y datos del curso de **Patrones de diseño orientado a objetos**.
