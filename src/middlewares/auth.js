const authorizeAdmin = (req, res, next) => {
    console.log('This is the first callback function for the /admin route');
    const token = "xyz";
    const isAuthorized = token === "xyz"; // Simulating authorization check
    if (isAuthorized) {
        next(); // User is authorized, proceed to the next middleware or route handler
    } else {
        res.status(403).send('Unauthorized access'); // User is not authorized, send a 403 response
    }
};

const userAuthorization = (req, res, next) => {
    console.log('This is the user authorization middleware');
    const token = "abc111";
    const isAuthorized = token === "abc";   // Simulating authorization check
    if (isAuthorized) {
        next(); // User is authorized, proceed to the next middleware or route handler
    } else {
        res.status(403).send('Unauthorized access'); // User is not authorized, send a 403 response
    }
};

module.exports = {
    authorizeAdmin,
    userAuthorization
};