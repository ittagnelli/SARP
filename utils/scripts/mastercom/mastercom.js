const axios = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

// URL e credenziali
const LOGIN_URL = process.env.LOGIN_URL;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

// mastercom id and key for session login and logout
let user_id, user_key, admin_id, admin_key;


// Crea client con cookie jar
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const get_user_id = html => {
    const userMatch = html.match(/var\s+current_user\s*=\s*'([^']+)'/);
    return userMatch ? userMatch[1] : null;
}

const get_user_key = html => {
    const keyMatch = html.match(/var\s+current_key\s*=\s*'([^']+)'/);
    return keyMatch ? keyMatch[1] : null;
}

const post = async (body) => {
    return await client.post(LOGIN_URL, body.toString(), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

const login_as_user = async () => {
    // Prepara i dati per il login
    const loginData = new URLSearchParams({
        user: USERNAME,
        password_user: PASSWORD,
        form_login: true,
        login_ts: new Date().getTime()
    });

    // Esegui POST di login
    // La risposta contiene l'HTML della pagina risultante dopo il login
    const html = (await post(loginData)).data;

    user_id = get_user_id(html);
    user_key = get_user_key(html);
}

const login_as_admin = async () => {
    await login_as_user();

    // Prepara i dati per il login
    const loginData = new URLSearchParams({
        search: '',
        form_stato: 'accedi_come',
        stato_principale: '',
        stato_secondario: '',
        current_user: user_id,
        current_key: user_key,
        tipo_accesso: 'amministratore',
        st: new Date().getTime()
    });

    // Esegui POST di login
    // La risposta contiene l'HTML della pagina risultante dopo il login
    const html = (await post(loginData)).data;

    admin_id = get_user_id(html);
    admin_key = get_user_key(html);
    
    return {
        admin_id,
        admin_key
    }
}


const logout = async (user, key) => {
    const logoutData = new URLSearchParams({
        search: '',
        form_stato: 'logout',
        stato_principale: '',
        stato_secondario: '',
        current_user: user,
        current_key: key,
        tipo_accesso: '',
        st: new Date().getTime()
    });

    const html = (await post(logoutData)).data;
}

const logout_as_admin = async () => {
    await logout(admin_id, admin_key);
    await logout(user_id, user_key);
}


module.exports = {
    post,
    login_as_user,
    login_as_admin,
    logout,
    logout_as_admin
};

