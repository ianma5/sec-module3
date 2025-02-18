const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {    
        if (!req?.roles) return res.sendStatus(401); // needs to have roles or will not be vcalid
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true); //new array with booleans, checks if true
        if (!result) return res.sendStatus(401);
        next(); // let the route be accessed
    }
}

module.exports = verifyRoles;