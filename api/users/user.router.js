const {
    controllerAddUser,
    controllerGetUsers,
    controllerGetUserById,
    controllerUpdateUser,
    controllerDeleteUser,
    controllerLogin
} = require("./user.controller");

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation")

router.post("/register", controllerAddUser);
router.get("/", checkToken, controllerGetUsers);
router.get("/profile", checkToken, controllerGetUserById);
router.patch("/", checkToken, controllerUpdateUser);
router.delete("/", checkToken, controllerDeleteUser);
router.post("/login", controllerLogin);

module.exports = router;
