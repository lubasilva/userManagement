class HomeController{

    async index(request, response){
        response.send("Home page");
    }

}

module.exports = new HomeController();