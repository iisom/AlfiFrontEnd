import React, { useContext, useEffect, useState } from "react"
import RoleListContext from "../Contexts/RoleListContext";
import { useParams } from "react-router-dom"
import RoleDetails from "./RoleDetails";

const DisplayRole = () => {
    const [roleListState,] = useContext(RoleListContext);
    const [role, setRole] = useState({})
    const {roleName} = useParams();

    useEffect(() => {
        if(roleName) {
            roleListState.forEach(role => {
                if(role.name === roleName) {
                    setRole(role);
                }
            });
        }
    }, [roleName, roleListState, setRole])

    return (
        <div className="DisplayRole">
            <RoleDetails role={role}></RoleDetails>
        </div>
    )
}

export default DisplayRole;