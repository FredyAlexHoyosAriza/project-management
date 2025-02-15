/**
 * Handler that will be called during the execution of a PostUserRegistration flow.
 *
 * @param {Event} event - Details about the user registration event.
 * @param {PostUserRegistrationAPI} api - Interface with methods to control the flow.
 */
exports.onExecutePostUserRegistration = async (event, api) => {
  // Define el endpoint de tu backend que registrará al usuario en tu DB.
  const endpoint = "https://your-backend.example.com/api/register-user";

  // Extrae los datos que deseas guardar.
  // Se asume que los campos personalizados se almacenan en user_metadata
  // (o en app_metadata, según tu flujo de registro)
  const userData = {
    user_id: event.user.user_id,
    email: event.user.email,
    name: event.user.user_metadata?.name || event.user.name || "sin_asignar",
    surname: event.user.user_metadata?.surname || "sin_asignar",
    idCard: event.user.user_metadata?.idCard || "0000000",
    role: event.user.user_metadata?.role || "STUDENT",
  };

  // Opcional: imprime en log para depuración
  console.log("Registering user in DB:", userData);
  try {
    // Realiza la llamada HTTP a tu backend
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Incluye una clave de API o token si tu endpoint lo requiere
        Authorization: "Bearer YOUR_SECRET_KEY",
      },
      body: JSON.stringify(userData),
    });

    // Puedes verificar la respuesta de tu API
    if (!response.ok) {
      console.error("Error registering user in DB", await response.text());
      // Decide si quieres fallar el flujo o solo loguear el error
    } else {
      console.log("User successfully registered in DB");
    }
  } catch (error) {
    console.error("Exception while registering user in DB", error);
    // No bloquees el flujo de registro; simplemente loguea el error
  }

  // El flujo de registro continúa; el usuario se registra en Auth0 de forma normal
};

// ## 4. **Buenas Prácticas y Consideraciones**
  
// - **Seguridad del Endpoint:**  
//   Asegúrate de que el endpoint de tu backend que recibe la información de registro esté protegido (por ejemplo, usando un token o API key). Esto evita que terceros puedan insertar datos en tu DB.

// - **Decoupling y Resiliencia:**  
//   La acción debe ser **resiliente**: si tu backend no responde o falla, no debes bloquear el registro del usuario. Simplemente registra el error y continúa. Posteriormente, puedes tener procesos de sincronización o reintentos.

// - **Monitoreo y Logs:**  
//   Agrega logs en la acción para monitorear si los registros en tu DB se están realizando correctamente. Esto es crucial para detectar problemas en producción.

// - **Consistencia de Datos:**  
//   Decide si guardarás la información en `user_metadata` o en `app_metadata` según el nivel de control que desees. Generalmente, los datos que el usuario puede modificar se guardan en `user_metadata`, mientras que los datos críticos de la aplicación se guardan en `app_metadata`.

// - **Refrescado de Tokens:**  
//   Recuerda que si el usuario ya está autenticado, su token no se actualizará automáticamente con la nueva información; deberás forzar un nuevo login o usar refresh tokens para reflejar cambios en los claims.

// ---

// ## 5. **Resumen del Proceso**

// 1. **Registro:**  
//    El usuario se registra mediante el formulario personalizado.  
//    Durante el registro, se guardan los campos estándar y personalizados en Auth0 (usando, por ejemplo, un Pre-User-Registration Action o desde el backend).

// 2. **Post-User-Registration Action:**  
//    Esta acción se ejecuta una vez que el usuario se ha registrado en Auth0.  
//    La acción extrae los datos relevantes (incluyendo `role`, `idCard`, `surname`, `name`, etc.) y hace una llamada a tu backend para registrar o actualizar el usuario en tu DB.

// 3. **Construcción de la Sesión:**  
//    La librería @auth0/nextjs-auth0 crea la cookie __session basándose en el ID Token y los tokens recibidos, los cuales pueden incluir custom claims si se agregaron en la acción de Post-Login.

// ---

// ## 6. **Conclusión**

// El proceso de registro en tu DB desde un Post-User-Registration Action consiste en:

// - Extraer los datos del usuario (tanto estándar como personalizados) desde el objeto `event.user`.
// - Realizar una llamada HTTP a tu API backend segura para registrar estos datos.
// - Asegurarse de que, en el flujo normal de Auth0, el usuario se registre y que la información esté disponible (si se necesita, mediante custom claims en el token).

// Esta es una solución escalable, segura y elegante que sigue las mejores prácticas para separar la lógica de autenticación y la persistencia de datos en tu sistema. ¿Te queda alguna duda o necesitas algún detalle adicional?

