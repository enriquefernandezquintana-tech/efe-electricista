# Backend de Enrique Fernández Electricista

La aplicación está preparada para pasar del prototipo local a una arquitectura cloud.

## Componentes

- Supabase Auth: acceso privado del propietario.
- PostgreSQL: clientes, servicios, agenda, facturas, gastos y solicitudes.
- Storage privado: facturas/tickets y documentos.
- Row Level Security: cada usuario solo puede leer y modificar sus propios datos.
- Edge Functions: automatizaciones futuras (OCR, generación de PDF, exportaciones y notificaciones).

## Puesta en marcha

1. Crear/conectar un proyecto Supabase.
2. Ejecutar `schema.sql` en el SQL Editor.
3. Configurar el proveedor de autenticación (email/password inicialmente).
4. Crear el usuario propietario.
5. Añadir las variables públicas de Supabase a la aplicación (`SUPABASE_URL` y `SUPABASE_ANON_KEY`).
6. Conectar la PWA a las tablas cloud y retirar progresivamente el almacenamiento local.

## Seguridad

Nunca guardar una `service_role_key` en el navegador ni en GitHub. Solo la clave pública/anon debe llegar al frontend. Las operaciones privilegiadas deben ejecutarse en Edge Functions.
