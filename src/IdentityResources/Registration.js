import { useContext, useState } from "react";
import HostContext from "./Contexts/HostContext";
import { failedMessage, successMessage } from "./IdentityLib";

// const decodedToken = jwtDecode(localStorage.getItem("token"));
// const guid = decodedToken.guid

const initialRegistrationState = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
}

const Registration = () => {
    const [registration, setRegistration] = useState(initialRegistrationState)
    const host = useContext(HostContext);
    const [message, setMessage] = useState('');

    const processRegistration = (e) => {
        e.preventDefault();
        const headers = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registration),
        }
        fetch(`${host.url}/account/register`, headers).then((response) => {
            if(response.ok) {
                console.log(response)
                setMessage(successMessage);
            } else {
                setMessage(failedMessage);
            }
        })
    }

    const inputUpdate = (e) => {
        setRegistration({
            ...registration,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="Registration">
            <form onSubmit={processRegistration}>
                {Object.keys(registration).map((key) => {
                    return (
                        <label key={key}>{key}
                            <input type={key !== 'password' ? 'text' : 'password'}
                                    id={`registration_${key}`}
                                    name={key}
                                    value={registration[key]}
                                    onChange={inputUpdate}
                            ></input>
                        </label>
                    )
                })}
                <button type="submit">Register</button>
                <span>{message}</span>
            </form>
        </div>
    )
}

export default Registration;