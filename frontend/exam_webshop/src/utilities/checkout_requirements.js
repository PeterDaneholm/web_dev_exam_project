export function verify_checkout(delivery, payment) {
    //Need to check whether all the components of each of the two parameters have actual values, i.e. not null or zero
    //After that it needs to return either true or false depending on whether that is the case or not
    //
    console.log(delivery)
    console.log(payment)
    for (const [key, value] of Object.entries(delivery)) {
        if (value === "" || value === 0) {
            return false
        }
    }
    for (const [key, value] of Object.entries(payment)) {
        if (value === "" || value === 0) {
            return false
        }
    }
    console.log("test")
    return true
}