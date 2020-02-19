const {
    controllerAddItem,
    controllerUpdateItem,
    controllerDeleteItem,
    controllerGetItem,
} = require("./barang.controller");

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation")

router.post("/add", checkToken, controllerAddItem);
router.patch("/", checkToken, controllerUpdateItem);
router.delete("/", checkToken, controllerDeleteItem);
router.get("/", checkToken, controllerGetItem);



module.exports = router;
