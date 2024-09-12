import { jwtDecode } from 'jwt-decode';


export const getDecodedToken = (token) => {
    try {
        return jwt_decode(token);
    } catch (error) {
        console.error('Token decoding failed:', error);
        return null;
    }
};

