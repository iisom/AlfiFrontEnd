import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../Contexts/AuthContext";
import HostContext from "../Contexts/HostContext";
import RoleListContext from "../Contexts/RoleListContext";

const RoleDetails = ({role}) => {
    const [authState, ] = useContext(AuthContext);
    const [, roleListDispatch] = useContext(RoleListContext);
    const host = useContext(HostContext);
    const navigate = useNavigate();

    const deleteRole = (e) => {
        // make our DELETE API call
        const requestHeaders = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authState.token,
            },
        }
        

        const resourceUrl = `${host.url}/admin/roles/${role.name.replace('ROLE_', "")}`
        fetch(resourceUrl, requestHeaders).then((response) => {
            if(response.ok) {
                console.log("Deleted Role")
                const action = {
                    type: 'removeRole',
                    payload: role,
                };
                // Dispatch to the roleListContext that the record was removed
                roleListDispatch(action)
                navigate('displayRoles');

            } else {
                // log errors
            }
        })

    }
    return (
        <div className="RoleDetails">
            <ul>
                <li>
                    Name - <Link to={`displayRoles/${role.name}`}>{role.name}</Link>
                </li>
                <li>
                    Description - {role.description}
                </li>
                <li><button onClick={(e) => deleteRole(e)}>Delete Role</button></li>
            </ul>
        </div>
    )
}

export default RoleDetails;