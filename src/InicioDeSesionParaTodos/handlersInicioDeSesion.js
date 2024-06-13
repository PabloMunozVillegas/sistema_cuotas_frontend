import { APIFunctions } from '../axiosInstance';
import ToastInstance from '../toastInstance';

const handleSubmitLogin = async (formData, setLoading, setToken, navigate) => {
    setLoading(true);
  
    try {
        const response = await APIFunctions.autenticacion.login(formData);
        const token = response.token;
        if (token) {
            localStorage.setItem('token', token);
            setToken(token);
            if(response.data.rol === 'Administrador'){
                navigate('/Inicio');
            } else if (response.data.rol === 'Cliente') {
                navigate('/Inicio/Cliente');
            }
        } else {
            ToastInstance({ type: 'error', message: 'Problemas al iniciar sesión' });
        }
    } catch (error) {
        handleErrorLogin(error); 
    } finally {
        setLoading(false);
    }
};

const handleErrorLogin = (error) => {
    if (error.response) {
        ToastInstance({ type: 'error', message: error.response.data.message });
    } else {
        console.error('Ocurrió un error al iniciar sesión:', error.message);
    }
};

const handleChangeLogin = (event, formData, setFormData) => {
    const { name, value } = event.target;
    setFormData({
        ...formData,
        [name]: value
    });
};

export { handleSubmitLogin, handleErrorLogin, handleChangeLogin };
