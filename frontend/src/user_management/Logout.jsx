import CookieStore from '../CookieStore';

const Logout = () => {

const cookie = new CookieStore();
        
    cookie.deleteToken();
    localStorage.setItem('isLoggedIn', false);
    window.location.href = '/login';

};

export default Logout;
