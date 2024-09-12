import RoleDetails from "./RoleDetails";

const RoleList = ({roles}) => {
    return (
        <div className="RoleList">
            <ul>
                {roles.map((role, index) => {
                    return <RoleDetails key={index} role={role}></RoleDetails>
                })}
            </ul>
        </div>
    )

}

export default RoleList;