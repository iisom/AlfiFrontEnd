import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./Contexts/AuthContext";
import HostContext from "./Contexts/HostContext";
import { jwtDecode } from 'jwt-decode';
import { failedMessage, successMessage } from "./IdentityLib";
import "./Login.css";

const initialRegistrationState = {
  username: "",
  password: "",
  email: "",
  firstName: "",
  lastName: "",
};

const Login = () => {
  const [, authDispatch] = useContext(AuthContext);
  const host = useContext(HostContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registration, setRegistration] = useState(initialRegistrationState);
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginRequest = { username: username, password: password };
    const headers = {
      method: "POST",
      "Content-Type": "application/json",
      body: JSON.stringify(loginRequest),
    };
    const requestUrl = `${host.url}/auth`;
  
    fetch(requestUrl, headers)
      .then((response) => {
        if (response.ok) {
          const authToken = response.headers.get("Authorization");
          localStorage.setItem("token", authToken);
          localStorage.setItem("username", username);
          authDispatch({
            type: "saveAuth",
            payload: { username, token: authToken },
          });
          setUsername("");
          setPassword("");
          setLoggedIn(true);
  
          try {
            const decodedToken = jwtDecode(authToken);
            console.log("Decoded Token:", decodedToken);
            localStorage.setItem("guid", decodedToken.guid);
            localStorage.setItem("firstName", decodedToken.first_name);
            localStorage.setItem("lastName", decodedToken.last_name);
            localStorage.setItem("email", decodedToken.email);
  
            // Check for ROLE_ADMIN in authorities array
            const userAuthorities = decodedToken.authorities || [];
            if (userAuthorities.includes("ROLE_ADMIN")) {
              navigate("/serviceFour");
            } else {
              //Fetch call for Checking if profile exists
              fetch('http://alfi-profiles.galvanizelabs.net/api/profiles/loginProfileId/' + localStorage.getItem("guid"), {
                method: 'GET', 
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              })
              .then(response => {
                console.log(response);
                console.log(localStorage)
                if (!response.ok) {
                  console.log("ERROR: Profile Not Found!!")
                  //Profile has not been added
                  //Fetch Call to add the profile
                  fetch('http://alfi-profiles.galvanizelabs.net/api/profiles', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                      loginProfileId: localStorage.getItem("guid"),
                      emailAddress: localStorage.getItem("email"),
                      firstName: localStorage.getItem("firstName"),
                      lastName: localStorage.getItem("lastName"),
                      hub: 1
                    })
                  })
                  .then(response => {
                    console.log(response)
                    console.log(localStorage)
                    // Handle the response
                  })
                  .catch(error => {
                    console.log("ERROR:" + {error})
                    // Handle errors
                  });
                  //End of Fetch Call
                }
                return response.json(); 
              })
              .then(data => {
                console.log(data); 
                console.log(data.profileId)
              })
              .catch(error => {
                console.error('Fetch error test:', error);
              });
                //End of Fetch
              navigate("/");
            }
          } catch (error) {
            console.error("Token decoding error:", error);
            setMessage("Failed to decode token.");
          }
        } else {
          setMessage(failedMessage);
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setMessage(failedMessage);
      });
  };
  
  
  const processRegistration = (e) => {
    e.preventDefault();
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registration),
    };

    const requestUrl = `${host.url}/account/register`;

    fetch(requestUrl, headers)
      .then((response) => {
        if (response.ok) {
          setMessage(successMessage);
          setIsRegistering(false);
          setRegistration(initialRegistrationState);
        } else {
          setMessage(failedMessage);
        }
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setMessage("An error occurred during registration.");
      });
  };

  const inputUpdate = (e) => {
    const { name, value } = e.target;
    setRegistration((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const logout = () => {
    localStorage.removeItem("token");
    authDispatch({ type: "saveAuth", payload: { username: "", token: "" } });
    setUsername("");
    setPassword("");
    setLoggedIn(false);
    navigate("/loggedOut");
  };

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("token"));
  }, []);

  return (
    <div className='login-form'>
        <div className="card-body">
          <h2 className="card-title text-center">
            {isRegistering ? "Register" : "Login"}
          </h2>
          {isRegistering ? (
            <form onSubmit={processRegistration}>
              {Object.keys(initialRegistrationState).map((key) => (
                <div key={key} className="form-group">
                  <label htmlFor={`registration_${key}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={key === "password" ? "password" : "text"}
                    id={`registration_${key}`}
                    name={key}
                    value={registration[key]}
                    onChange={inputUpdate}
                    className="form-control"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setIsRegistering(false)}
                >
                  Already have an account? Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Login
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setIsRegistering(true)}
                >
                  Don't have an account? Register
                </button>
              </div>
            </form>
          )}
          {message && <div className="alert alert-danger mt-3">{message}</div>}
          {loggedIn && (
            <div className="text-center mt-3">
              <button type="button" className=" btn-primary" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default Login;
