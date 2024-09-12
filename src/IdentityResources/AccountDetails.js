import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "./Contexts/AuthContext";
import HostContext from "./Contexts/HostContext";

const initialAccountState = { user: {}, roles: []}

const AccountDetails = () => {
    const [authState, ] = useContext(AuthContext);
    const host = useContext(HostContext);

    const [accountDetails, setAccountDetails] = useState(initialAccountState)
    
    const getAccountDetails = useCallback(() => {
        const headers = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authState.token,
            },
        }
        fetch(`${host.url}/account`, headers).then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                return initialAccountState;
            }
        }).then((data) => {
            setAccountDetails(data);
        })
    }, [authState.token, host.url])
    
    useEffect(() => {
        if(authState.username) {
            getAccountDetails()
        } else {
            setAccountDetails(initialAccountState)
        }

    }, [authState, getAccountDetails])
    return (
        <div className="AccountDetails">
            <h1>Account Details</h1>
            <ul>
                {Object.keys(accountDetails.user).map((key) => {
                    return <li key={key}>{key} - {accountDetails.user[key]}</li>;
                })}
                <li>
                Roles
                    <ul>
                        {accountDetails.roles.map((role, index) => {
                            return <li key={index}>{role.name}</li>;
                        })}
                    </ul>
                </li>
            </ul>
        </div>
    )
}

export default AccountDetails;