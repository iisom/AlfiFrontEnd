import { useCallback, useContext, useEffect } from "react";
import AuthContext from "../Contexts/AuthContext";
import RoleListContext from "../Contexts/RoleListContext";
import { apiRequestWithToken } from "../IdentityLib";
import AddRole from "./AddRole";
import { Link } from "react-router-dom";

const initialRoles = [];

const DisplayRoles = () => {
    const [authState, ] = useContext(AuthContext);
    const [roleListState, roleListDispatch] = useContext(RoleListContext);

    const getRoles = useCallback(() => {
        apiRequestWithToken('GET', 'admin/roles', authState.token, initialRoles, (data) => {
            roleListDispatch({type: 'setRoleList', payload: data})
        })
    }, [authState.token, roleListDispatch])
    
    useEffect(() => {
        if(authState.username) {
            getRoles()
        } else {
            roleListDispatch({type: 'setRoleList', payload: initialRoles})
        }

    }, [authState, getRoles, roleListDispatch])

    return (
        <div className="DisplayRoles">
            <AddRole></AddRole>
            <h1>Display Roles</h1>
            <ul>
                {roleListState.map(role => {
                    return (
                        <li key={role.name}><Link to={`${role.name}`}>{role.name}</Link></li>
                    )
                })}
            </ul>
        </div>
    )
}

export default DisplayRoles;