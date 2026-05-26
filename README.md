# App de Rutas — Vendedor

PWA en React para gestión de rutas de ventas, integrable con ODOO.

## Cómo levantar en tu computadora

### Requisitos previos
- Node.js 18+ (descargarlo de https://nodejs.org)
- npm (viene incluido con Node.js)

### Pasos

```bash
# 1. Entrá a la carpeta del proyecto
cd vendedor-app

# 2. Instalá las dependencias (solo la primera vez)
npm install

# 3. Arrancá la app en modo desarrollo
npm start
```

La app se abre automáticamente en http://localhost:3000

---

## Estructura del proyecto

```
src/
  App.js              ← Punto de entrada, define las rutas de navegación
  index.css           ← Sistema de diseño completo (colores, tipografía, componentes)
  
  context/
    AppContext.js      ← Estado global (clientes, pedidos, acciones)
  
  data/
    mockData.js        ← Datos de prueba (reemplazar con llamadas a tu API)
  
  hooks/
    useTimer.js        ← Timer para medir tiempo en visita
  
  components/
    UI.js              ← Componentes reutilizables (botones, pills, cards)
  
  screens/
    HomeScreen.js      ← Pantalla principal con ruta del día
    ClienteScreen.js   ← Visita a cliente con timer y tareas
    PedidoScreen.js    ← Carga de pedido con lista de precios
    OtherScreens.js    ← No compra, confirmado, pedidos, estadísticas
```

---

## Cómo conectar con ODOO (Paso 2)

En `src/data/mockData.js` están los datos hardcodeados.
Cuando tengas el servidor listo, cada función de datos se reemplaza por una llamada a tu API:

```js
// ANTES (mock):
export const PRODUCTOS = [ ... ];

// DESPUÉS (con API):
export async function getProductos() {
  const res = await fetch('https://tu-servidor.com/api/productos');
  return res.json();
}
```

Los endpoints que necesitarás en tu servidor:
- GET  /api/clientes?vendedor_id=1&fecha=hoy
- GET  /api/productos?lista=A
- POST /api/pedidos
- POST /api/visitas
- GET  /api/estadisticas?vendedor_id=1

---

## Cómo subir a Vercel (Paso 2)

1. Crear cuenta en https://vercel.com (gratis)
2. Instalar Vercel CLI: `npm i -g vercel`
3. Desde la carpeta del proyecto: `vercel`
4. Seguir los pasos en pantalla

O más fácil todavía: subir la carpeta a GitHub y conectar el repo en vercel.com — lo despliega automáticamente.

---

## Próximos pasos

- [ ] Módulo Chofer (rutas de delivery, cobro, cta. corriente)
- [ ] Servidor Node.js + conexión ODOO
- [ ] Mapa real con Leaflet + optimización de ruta
- [ ] Autenticación (login por vendedor)
- [ ] Modo offline (Service Worker)
- [ ] Módulo de reportes avanzados
