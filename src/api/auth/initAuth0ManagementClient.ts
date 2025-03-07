import { ManagementClient } from "auth0";

// 🔹 Obtener token de gestión desde Auth0
const getManagementToken = async (): Promise<string> => {
  const response = await fetch(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        //Auth0 Management API audience => solicitud de token hacia el audience
        //para posteriores requests hacia ese mismo audience
        audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
        grant_type: "client_credentials",
      }),
    }
  );
 // Este audience es el identificador de la Management API de Auth0, que permite administrar usuarios,
 // roles y configuraciones dentro de Auth0; Está dirigido a Auth0 en sí mismo.
 // El audience indica donde se enviaría el token una vez fuese obtenido

  if (!response.ok) {
    console.error("Error fetching auth0 app token:", response);
    throw new Error("Error obteniendo el token de Auth0");
  }

  const data = await response.json();
  return data.access_token;
};

// 🔹 Inicializar ManagementClient con token dinámico
export const initAuth0ManagementClient = async () => {
  const token = await getManagementToken();

  return new ManagementClient({
    domain: process.env.AUTH0_DOMAIN!,
    token,
  });
};
