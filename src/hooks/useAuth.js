import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const userAuthorities = decodedToken.authorities || [];
        setIsAdmin(userAuthorities.includes("ROLE_ADMIN"));
      } catch (error) {
        console.error("Token decoding error:", error);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  return { isAdmin };
};
