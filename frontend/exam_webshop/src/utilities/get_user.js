import api from "../api";

async function GetUser() {
    try {
        const response = await api.get("/users/me", {
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const refreshResponse = await api.get("/token/refresh", {
                withCredentials: true
            })
            console.log(refreshResponse.status)
            if (refreshResponse.status === 200) {
                const retryRepsonse = await api.get("/users/me", {
                    withCredentials: true
                })
                return retryRepsonse.data;
            } else {
                throw error
            }
        } else {
            throw error
        }
    }
}

export async function onAdminRouteLoad(navigate) {
    try {
        const user = await GetUser();

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