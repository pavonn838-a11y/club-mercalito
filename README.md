# Club Mercalito

App Next.js + Supabase para registrar clientes desde QR por sucursal y exportar campañas de WhatsApp.

## Qué incluye

- Landing mobile first en `/club?local=olavarria`.
- Registro con nombre, WhatsApp, aceptación obligatoria y detección automática de sucursal.
- Evita duplicados por WhatsApp.
- Panel privado con login en `/login`.
- Dashboard con métricas.
- Clientes con filtros, buscador, bajas y exportación CSV.
- Campañas con variables `{nombre}` y `{sucursal}`, CSV personalizado y envío por WhatsApp API cuando están cargadas las credenciales.
- Sucursales con link de registro, copiar link y descarga de QR PNG.
- SQL de tablas, índices, vista de métricas y datos de ejemplo.

## Variables de entorno

Copiá `.env.example` como `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

WHATSAPP_ACCESS_TOKEN=tu_token_de_whatsapp
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
WHATSAPP_TEMPLATE_NAME=nombre_de_la_plantilla_aprobada
WHATSAPP_TEMPLATE_LANGUAGE=es_AR
WHATSAPP_API_VERSION=v20.0
```

`SUPABASE_SERVICE_ROLE_KEY` queda solo del lado servidor. No la expongas en el navegador.

Las variables de WhatsApp se cargan cuando ya tenés WhatsApp Business Platform o un proveedor conectado. La plantilla aprobada debe aceptar 3 variables en este orden: nombre del cliente, sucursal y mensaje personalizado.

## Crear la base en Supabase

1. Entrá a Supabase.
2. Abrí SQL Editor.
3. Ejecutá `supabase/schema.sql`.
4. Ejecutá `supabase/seed.sql` para cargar sucursales y datos de prueba.
5. En Authentication, creá un usuario para el panel.
6. Copiá el `id` del usuario creado y ejecutá:

```sql
insert into public.profiles (id, role)
values ('ID_DEL_USUARIO', 'administrador');
```

También podés usar el rol `oficina`.

## Correr localmente

```bash
npm install
npm run dev
```

Abrí:

- Cliente: `http://localhost:3000/club?local=olavarria`
- Panel: `http://localhost:3000/login`

## Producción

La forma más simple es Vercel:

1. Subí el proyecto a GitHub.
2. Importalo en Vercel.
3. Cargá las mismas variables de entorno.
4. Cambiá `NEXT_PUBLIC_SITE_URL` por el dominio final, por ejemplo `https://club.mercalito.com`.
5. Deploy.

## QR por sucursal

En el panel, entrá a `Sucursales`. Cada local muestra:

- Link de registro: `https://tu-dominio.com/club?local=olavarria`
- Botón para copiar el link.
- Botón para descargar el QR en PNG.

Ese QR es el que se imprime y pega en cada sucursal. El cliente no elige local: el sistema lo toma del parámetro `local`.

## Envío por WhatsApp API

En `Campañas`, cada campaña en borrador muestra el botón `Enviar por WhatsApp`. El sistema:

- Filtra solo clientes activos con `opt_in = true`.
- Excluye bajas.
- Personaliza `{nombre}` y `{sucursal}`.
- Envía usando una plantilla aprobada de WhatsApp.
- Marca la campaña como enviada si hubo envíos correctos.

Si faltan las variables de WhatsApp, el panel muestra un aviso y no manda mensajes.
