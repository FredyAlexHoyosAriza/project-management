# Project Management

Project Management es una aplicación monolítica desarrollada con tecnologías modernas para la gestión eficiente de proyectos. Permite crear tareas, asignarlas a miembros del equipo y visualizar el progreso en tiempo real, utilizando GraphQL y Apollo tanto en el frontend como en el backend.

Este proyecto está en continua evolución y es susceptible a cambios. Actualmente, la rama `dev` es la principal en desarrollo y está desplegada en Vercel.

## Características

- **Gestión de Proyectos**: Crea y organiza múltiples proyectos.
- **Tareas y Asignaciones**: Define tareas y asigna responsables.
- **Interfaz Reactiva**: Diseño moderno y responsivo con Next.js y Tailwind CSS.
- **GraphQL con Apollo**: Backend basado en GraphQL con Apollo Server y frontend que consume datos con Apollo Client.
- **Autenticación y Seguridad**: Manejo de usuarios y permisos (si aplica).

## Tecnologías Utilizadas

### Frontend

- **Next.js 2025** - Framework de React con App Router.
- **React** - Biblioteca para construir interfaces dinámicas.
- **TypeScript** - Tipado estático para mayor robustez.
- **Apollo Client** - Gestión eficiente de estado con GraphQL.
- **Tailwind CSS** - Estilos modernos y reutilizables.

### Backend (GraphQL API)

- **Node.js** - Entorno de ejecución en el servidor.
- **Apollo Server** - Implementación de GraphQL.
- **MongoDB + Mongoose** - Base de datos NoSQL para almacenamiento.

## Instalación y Configuración

En el directorio del proyecto, sigue estos pasos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/FredyAlexHoyosAriza/project-management.git
cd project-management
```

### 2. Instalar dependencias

```bash
npm install
# o con Yarn
yarn install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

### 4. Ejecutar el backend (GraphQL + Apollo Server)

```bash
npm run dev:server
# o con Yarn
yarn dev:server
```

El servidor estará disponible en [http://localhost:4000/graphql](http://localhost:4000/graphql).

### 5. Ejecutar el frontend (Next.js + Apollo Client)

```bash
npm run dev
# o con Yarn
yarn dev
```

El frontend estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

```plaintext
project-management/
│── src/
│   ├── app/            # Rutas y lógica del frontend (App Router de Next.js 2025)
│   ├── api/            # Backend (Apollo Server, resolvers, schemas)
│   ├── components/     # Componentes reutilizables de React
│   ├── styles/         # Estilos con Tailwind
│   ├── utils/          # Funciones auxiliares
│── public/             # Assets estáticos
│── .env                # Variables de entorno
│── package.json        # Dependencias y scripts
│── README.md           # Este archivo ✨
```

## Uso de la API GraphQL

Puedes explorar los endpoints de GraphQL en [https://dev-project-management.vercel.app/api/graphql] con Apollo Sandbox o herramientas como Postman.

Ejemplo de una consulta GraphQL para obtener proyectos:

```graphql
query {
  projects {
    id
    name
    description
    tasks {
      title
      status
    }
  }
}
```

## Contribuir

Las contribuciones son bienvenidas. Para colaborar:

1. Haz un fork del repositorio.
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m 'Añadir nueva funcionalidad'`.
4. Sube tus cambios: `git push origin feature/nueva-funcionalidad`.
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Contacto

- **GitHub**: [FredyAlexHoyosAriza](https://github.com/FredyAlexHoyosAriza)
- **LinkedIn**: [Fredy Alexander Hoyos Ariza](https://www.linkedin.com/in/fredy-alexander-hoyos-ariza-3b7122167/)

---

✨ ¡Gracias por revisar este proyecto! Espero que te sea útil. 🚀