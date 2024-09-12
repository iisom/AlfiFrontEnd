import React from "react";
import { url } from "../IdentityLib";

const HostContext = React.createContext({
    url: url,
});

export default HostContext;