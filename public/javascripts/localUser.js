class LocalUser {
    constructor() {
    }
    storeUser(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }
    
    getStoredUser(key) {
        if (localStorage) {
            return localStorage.getItem(key);
        } else {
            return false;
        }
    }

    removeUser(key){
        if(localStorage) {
            return localStorage.removeItem(key);
        }
    }

    storeProjectName(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }
    
    getStoredProjectName(key) {
        if (localStorage) {
            return localStorage.getItem(key);
        } else {
            return false;
        }
    }

    removeProjectName(key){
        if(localStorage) {
            return localStorage.removeItem(key);
        }
    }
}
