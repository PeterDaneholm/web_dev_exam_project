import api from "../api";

async function GetUser() {
    const response = await api.get("/users/me", {
        withCredentials: true,
    })
    //console.log("response", response)
    return response.data
}

export async function onAdminRouteLoad(navigate) {
    try {
        const user = await GetUser();
        //console.log("user", user)

        if (user.scopes === ("Admin")) {
            return null
        } else {
            redirectToShop(navigate);
        }
    } catch (error) {
        //console.log("Error", error)
        redirectToLogin(navigate);
    }
}

function allowAdmin() {

}

function redirectToLogin(navigate) {
    navigate("/login")
}

function redirectToShop(navigate) {
    navigate("/shop")
}