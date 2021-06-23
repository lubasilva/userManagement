const express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require('../controllers/UserController');


router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user', UserController.index);
router.get('/user/:id', UserController.findUser);
router.put('/user', UserController.edit)
router.delete('/user/:id', UserController.deleteUser);
router.post('/recoverPassword', UserController.recoverPassword);

module.exports = router;