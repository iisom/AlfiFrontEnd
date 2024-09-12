import React, { useContext, useState } from "react";
import AuthContext from "../Contexts/AuthContext";
import RoleListContext from "../Contexts/RoleListContext";
import { apiRequestWithTokenWithData } from "../IdentityLib";

const initialRoleState = { "name": "", "description": "" };

const AddRole = () => {
    const [authState,] = useContext(AuthContext);
    const [, roleListDispatch] = useContext(RoleListContext);
    const [role, setRole] = useState(initialRoleState)

    const saveRole = (e) => {
        e.preventDefault();
        const resource = "admin/roles";
        apiRequestWithTokenWithData("POST", resource, authState.token, JSON.stringify(role), {}, (data) => {
            const action = {
                type: 'addRoleToList',
                payload: data,
            }
            roleListDispatch(action)
            setRole(initialRoleState);
        })
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const roleKey = e.target.name;
        const copyOfRole = {...role};
        copyOfRole[roleKey] = value;
        setRole(copyOfRole);
    }

    return (
        <div className="AddRole">
            <h1>Add Role</h1>
            <form onSubmit={saveRole}>
                <label>
                    Name:
                    <input type="text" name="name" value={role.name} onChange={inputChange} />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={role.description} onChange={inputChange} />
                </label>
                <button type="submit">Save Role</button>
            </form>
        </div>
    )
}

export default AddRole;