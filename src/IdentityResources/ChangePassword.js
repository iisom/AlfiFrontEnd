import { useContext, useState } from "react";
import AuthContext from "./Contexts/AuthContext";
import HostContext from "./Contexts/HostContext";
import { failedMessage, successMessage } from "./IdentityLib";

const initialChangePassword = {
    username: "",
    currentPassword: "",
    newPassword: ""
}

const ChangePassword = () => {
    const [authState,] = useContext(AuthContext);
    const host = useContext(HostContext);
    const [message, setMessage] = useState('');
    const [changePasswordDetails, setChangePasswordDetails] = useState(initialChangePassword);

    const processChangePassword = (e) => {
        e.preventDefault();
        const data = JSON.stringify(changePasswordDetails);
        const headers = {
             method: 'PATCH',
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': authState.token,
             },
             body: data,
         }
         fetch(`${host.url}/account/passwd`, headers).then((response) => {
            if(response.ok) {
                setMessage(successMessage)
            } else {
                setMessage(failedMessage);
            }
         })
    }

    const inputUpdate = (e) => {
        setChangePasswordDetails({
            ...changePasswordDetails,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div className="ChangePassword">
            <form onSubmit={processChangePassword}>
                {Object.keys(changePasswordDetails).map((key) => {
                    return (
                        <label key={key}>{key}
                            <input type={!key.includes('Password') ? 'text' : 'password'}
                                id={`change_pwd_${key}`}
                                name={key}
                                value={changePasswordDetails[key]}
                                onChange={inputUpdate}
                            ></input>
                        </label>
                    )
                })}
                <button type="submit">Change Password</button>
                <span>{message}</span>
            </form>
        </div>
    )

}

export default ChangePassword;