import axios from 'axios';

const API_BASE_URL = 'https://sistema-cuotas.onrender.com';

const makeRequest = async (method, url, data = null, idUrl = null, token= null) => {
  try {
    let axiosMethod;
    switch (method) {
      case 'GET':
        axiosMethod = axios.get;
        break;
      case 'POST':
        axiosMethod = axios.post;
        break;
      case 'PUT':
        axiosMethod = axios.put;
        break;
      case 'DELETE':
        axiosMethod = axios.delete;
        break;
      default:
        throw new Error(`HTTP method ${method} not supported`);
    }

    const completeUrl = idUrl ? `${url}/${idUrl}` : url;
    console.log("Enviando solicitud a:", completeUrl);
    console.log("Headers:", token ? { headers :{ Authorization: `Bearer ${token}` } } : null);

    const response = await axiosMethod(completeUrl, data, token ? { headers: {  Authorization: `Bearer ${token}` }} : null);

    if (!response) {
      throw new Error('No se recibió respuesta del servidor');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createAPIFunction = (props) => {
  const { method, url, idUrl } = props;
  return async (data = null, token = null) => {
    const completeUrl = `${API_BASE_URL}${url}`;
    try {
      return await makeRequest(method, completeUrl, data, idUrl, token);
    } catch (error) {
      throw error;
    }
  };
};

const APIRoutes = {
  autenticacion: {
    getClientes: { method: 'GET', url: '/api/autenticacion/listar/clientes' },
    delete: { method: 'DELETE', url: '/api/autenticacion/eliminar' },
    create: { method: 'POST', url: '/api/autenticacion/create' },
    login: { method: 'POST', url: '/api/autenticacion/login' },
  },
};

const APIFunctions = {};
Object.keys(APIRoutes).forEach((api) => {
  APIFunctions[api] = {};
  Object.keys(APIRoutes[api]).forEach((route) => {
    const urlProps = APIRoutes[api][route];
    APIFunctions[api][route] = createAPIFunction(urlProps);
  });
});

export { APIFunctions };
