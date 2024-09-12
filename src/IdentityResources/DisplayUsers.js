import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "./Contexts/AuthContext";
import UserListContext from "./Contexts/UserListContext";
import { apiRequestWithToken } from "./IdentityLib";

const initialUsers = [];

const DisplayUsers = () => {
    const [authState,] = useContext(AuthContext);
    const [, userListDispatch] = useContext(UserListContext);

    const [users, setUsers] = useState(initialUsers);

    const getUsers = useCallback(() => {
        apiRequestWithToken('GET', 'admin/users', authState.token, initialUsers, (data) => {
            setUsers(data.userSearchResults);
            userListDispatch({type: 'setUserList', payload: data.userSearchResults})
        })
    }, [authState.token, userListDispatch])

    // const deleteUser = (e, username) => {
    //     apiRequestWithToken('DELETE', `admin/users/${username}`, authState.token, {})
    // }
    
    useEffect(() => {
        if(authState.username) {
            getUsers()
        } else {
            setUsers(initialUsers)
        }

    }, [authState, getUsers])

    return (
        <div className="DisplayUsers">
            <h1>Display Users</h1>
            { users.map((user, index) => {
                return (
                    <div key={index}>
                        <li key={index}> {user.username} - {user.firstName} {user.lastName} - {user.email}</li>
                        {/* <button onClick={(e) => deleteUser(e, user.username)}>Delete</button> */}
                    </div>
                )
            })}
        </div>
    )
}

export default DisplayUsers;