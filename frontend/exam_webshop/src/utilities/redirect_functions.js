import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";


export default function alreadyLogin(navigate) {
    const token = Cookies.get('token')

    if (!token) {
        return null
    }
    console.log("Already logged in, redirecting")
    navigate("/products")
    return null
}