import axios from 'axios';

const API_BASE_URL = 'https://sistema-cuotas.onrender.com';

const makeRequest = async (method, url, data = null, token = null) => {
  try {
    const config = {
      method,
      url,
      headers: { Authorization: `Bearer ${token}` },
      data,
    };

    const response = await axios(config);
    if (!response) {
      throw new Error('No se recibió respuesta del servidor');
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

const pollRequest = async (method, url, data = null, token = null, interval = 1000, callback) => {
  try {
    const config = {
      method,
      url,
      headers: { Authorization: `Bearer ${token}` },
      data,
    };

    const response = await axios(config);
    if (response) {
      callback(response.data);
    }
  } catch (error) {
    console.error('Polling error:', error);
  } finally {
    setTimeout(() => pollRequest(method, url, data, token, interval, callback), interval);
  }
};

const createAPIFunction = (props) => {
  const { method, url } = props;
  return async (data = null, enlace = '', token = null, poll = false, interval = 5000, callback) => {
    let completeUrl = `${API_BASE_URL}${url}`;
    if (enlace) {
      completeUrl += `/${enlace}`;
    }
    try {
      const payload = {
        idPago: data
      };
      if (poll) {
        pollRequest(method, completeUrl, url === '/api/pagos/create' ? payload : data, token, interval, callback);
      } else {
        return await makeRequest(method, completeUrl, url === '/api/pagos/create' ? payload : data, token);
      }
    } catch (error) {
      throw error;
    }
  };
};

const loginAPIFunction = (props) => {
  const { method, url } = props;
  return async (data) => {
    const completeUrl = `${API_BASE_URL}${url}`;
    try {
      return await makeRequest(method, completeUrl, data);
    } catch (error) {
      throw error;
    }
  };
};

const searchAPIFunction = (props) => {
  const { method, url } = props;
  return async (enlace = '', token, poll = false, interval = 5000, callback) => {
    let completeUrl = `${API_BASE_URL}${url}`;
    if (enlace) {
      completeUrl += `?${enlace}`;
    }
    try {
      if (poll) {
        pollRequest(method, completeUrl, null, token, interval, callback);
      } else {
        return await makeRequest(method, completeUrl, null, token);
      }
    } catch (error) {
      throw error;
    }
  };
};

const searchOtherAPIFunction = (props) => {
  const { method, url } = props;
  return async (enlace = '', token, poll = false, interval = 5000, callback) => {
    let completeUrl = `${API_BASE_URL}${url}`;
    if (enlace) {
      completeUrl += `/${enlace}`;
    }
    try {
      if (poll) {
        pollRequest(method, completeUrl, null, token, interval, callback);
      } else {
        return await makeRequest(method, completeUrl, null, token);
      }
    } catch (error) {
      throw error;
    }
  };
};

const deleteAPIFunction = (props) => {
  const { method, url } = props;
  return async (enlace = '', token, poll = false, interval = 5000, callback) => {
    let completeUrl = `${API_BASE_URL}${url}`;
    if (enlace) {
      completeUrl += `/${enlace}`;
    }
    try {
      if (poll) {
        pollRequest(method, completeUrl, null, token, interval, callback);
      } else {
        return await makeRequest(method, completeUrl, null, token);
      }
    } catch (error) {
      throw error;
    }
  };
};

const actualizarAPIFunction = (props) => {
  const { method, url } = props;
  return async (data = null, enlace = '', token = null, poll = false, interval = 5000, callback) => {
    let completeUrl = `${API_BASE_URL}${url}`;
    if (enlace) {
      completeUrl += `/${enlace}`;
    }
    try {
      if (poll) {
        pollRequest(method, completeUrl, data, token, interval, callback);
      } else {
        return await makeRequest(method, completeUrl, data, token);
      }
    } catch (error) {
      throw error;
    }
  };
};

const APIRoutes = {
  autenticacion: {
    urlIdUnico: { method: 'GET', url: '/api/autenticacion/cliente' },
    listarAdmin: { method: 'GET', url: '/api/autenticacion/listar/administradores' },
    listarUrl: { method: 'GET', url: '/api/autenticacion/listar/clientes' },
    actualizar: { method: 'PATCH', url: '/api/autenticacion/actualizar' },
    delete: { method: 'DELETE', url: '/api/autenticacion/eliminar' },
    deshabilitar: { method: 'DELETE', url: '/api/autenticacion/desactivar/cuenta' },
    create: { method: 'POST', url: '/api/autenticacion/create' },
    login: { method: 'POST', url: '/api/autenticacion/login' },
  },
  producto: {
    create: { method: 'POST', url: '/api/productos/create' },
    listarUrl: { method: 'GET', url: '/api/productos/listar' },
    urlIdUnico: { method: 'GET', url: '/api/productos' },
    actualizar: { method: 'PATCH', url: '/api/productos' },
    delete: { method: 'DELETE', url: '/api/productos' },
  },
  cuotas: {
    create: { method: 'POST', url: '/api/cuotas/create' },
    urlIdUnico: { method: 'GET', url: '/api/cuotas/listar/cliente' },
  },
  pagos: {
    create: { method: 'POST', url: '/api/pagos/create' },
    urlIdUnicoCliente: { method: 'GET', url: '/api/pagos/listar' },
    urlIdUnico: { method: 'GET', url: '/api/pagos/listar/mes' },
  },
};

const urlSearchOther = ['urlIdUnico', 'urlIdUnicoCliente'];
const urlSearch = ['listarUrl', 'listarAdmin'];
const APIFunctions = {};
Object.keys(APIRoutes).forEach((api) => {
  APIFunctions[api] = {};
  Object.keys(APIRoutes[api]).forEach((route) => {
    const urlProps = APIRoutes[api][route];
    if (route === 'login') {
      APIFunctions[api][route] = loginAPIFunction(urlProps);
    } else if (urlSearch.includes(route)) {
      APIFunctions[api][route] = searchAPIFunction(urlProps);
    } else if (urlSearchOther.includes(route)) {
      APIFunctions[api][route] = searchOtherAPIFunction(urlProps);
    } else if (route === 'create') {
      APIFunctions[api][route] = createAPIFunction(urlProps);
    } else if (route === 'delete') {
      APIFunctions[api][route] = deleteAPIFunction(urlProps);
    } else if (route === 'actualizar') {
      APIFunctions[api][route] = actualizarAPIFunction(urlProps);
    }
  });
});

export { APIFunctions };
