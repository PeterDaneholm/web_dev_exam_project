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
        //console.log(user)

        if (user.role === "Admin") {
            return null
        } else {
            redirectToShop(navigate);
        }
    } catch (error) {
        redirectToLogin(navigate);
    }
}

export async function isUserLoggedIn(navigate) {
    try {
        const response = await api.get("/users/me", {
            withCredentials: true
        })

        if (response.status !== 200) {
            navigate("/login")
        } else {
            return null
        }

    } catch (error) {
        console.error(error)
        navigate("/login")
    }
}

export async function hasToken(navigate) {
    try {
        const response = await api.get("/checktoken", {
            withCredentials: true,
        })

        if (!response.data.valid) {
            navigate("/login")
        } else {
            navigate("/shop")
        }

    } catch (error) {
        console.error("Error checking token", error)
        navigate("/login")
    }
}


function redirectToLogin(navigate) {
    navigate("/login")
}

function redirectToShop(navigate) {
    navigate("/shop")
}