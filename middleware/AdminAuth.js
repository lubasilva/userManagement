const jwt = require("jsonwebtoken");
const secret = "12345";

module.exports = function(request, response, next){
    const authToken = request.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        let token = bearer[1];

        try{
            let decoded = jwt.verify(token,secret);
            
            if(decoded.role == 1){
                next();
            }else{
                response.status(403);
                response.send("Você não tem permissão para isso!");
                return;
            }
        }catch(err){
            response.status(403);
            response.send("Você não está autenticado");
            return;
        }
    }else{
        response.status(403);
        response.send("Você não está autenticado");
        return;
    }
}