import Cookies from 'universal-cookie';

// function getToken(){
//     const cookies = new Cookies();
//     const token =  cookies.get('token');
//     return token;
// }


// function setToken(token){
//     const cookies = new Cookies();
//     const token =  cookies.get('token');
// }

class CookieStore{
    constructor(){
        this.cookies = new Cookies();
    }

    getToken(){
        return this.cookies.get('token')
    }

    setToken(token){
        return this.cookies.set('token', token);
    }

    deleteToken(){
        this.cookies.remove('token');
    }
}

export default CookieStore;