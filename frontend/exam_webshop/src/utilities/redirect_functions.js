import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export default function alreadyLogin(navigate) {
    const token = Cookies.get('token')

    if (!token) {
        return null
    }
    const decoded = jwtDecode(token)
    console.log("Already logged in, redirecting")

    if (decoded.scopes == "Admin") {
        navigate("/admin")
    } else {
        navigate("/products")
    }
    return null
}