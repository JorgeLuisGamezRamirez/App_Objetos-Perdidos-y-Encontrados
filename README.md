# Aplicación de Objetos Perdidos y Encontrados

## Caso de Estudio
Desarrollar una aplicación móvil que permita a los usuarios publicar objetos perdidos o encontrados, facilitar su recuperación y recibir notificaciones sobre posibles coincidencias.

---

## Funcionalidades
- **Autenticación:** Iniciar sesión utilizando Google OAuth 2.0.
- **Perfil de Usuario:** Mostrar el perfil del usuario con nombre, correo y fotografía.
- **Publicaciones:** Publicar objetos perdidos o encontrados incluyendo nombre, descripción, fotografía, categoría, ubicación y fecha.
- **Consulta:** Consultar publicaciones de otros usuarios.
- **Búsqueda y Filtros:** Buscar y filtrar objetos por categoría, ubicación o fecha.
- **Detección de Coincidencias:** Detectar posibles coincidencias entre objetos perdidos y encontrados.
- **Notificaciones Push:** Enviar notificaciones push mediante Firebase Cloud Messaging (FCM) cuando exista una posible coincidencia.
- **Chat Interactivo:** Permitir que los usuarios contacten al responsable de una publicación mediante un chat.
- **Notificaciones de Mensajería:** Recibir notificaciones de nuevos mensajes.
- **Gestión de Estado:** Marcar objetos como recuperados o entregados.
- **Historial Personal:** Consultar el historial de publicaciones personales.

---

## Reglas Principales
- Para publicar o contactar a otros usuarios es obligatorio iniciar sesión con Google.
- Cada usuario puede editar o eliminar únicamente sus publicaciones.
- Las coincidencias se identifican considerando categoría, descripción y ubicación.
- Al seleccionar una notificación, se abre directamente la publicación o conversación correspondiente.
- Las publicaciones resueltas dejan de aparecer entre los objetos pendientes.
- Las notificaciones funcionan incluso cuando la aplicación está cerrada.

---

## Objetivo
Implementar autenticación con Google OAuth 2.0, notificaciones push mediante Firebase Cloud Messaging, gestión de sesiones, comunicación entre usuarios y navegación desde notificaciones.

---

## Estructura de Tecnologías y Arquitectura
- **Frontend / Móvil:** React Native con Expo & TypeScript.
- **Navegación:** React Navigation (Native Stack).
- **Backend & Base de Datos:** Firebase / Cloud Firestore & AsyncStorage Service.
- **Notificaciones Push:** Firebase Cloud Messaging (FCM) & Expo Notifications.
- **Autenticación:** Google OAuth 2.0 / Firebase Auth.
