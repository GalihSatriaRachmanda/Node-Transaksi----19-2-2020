const {
    controllerAddTransaksi,
    controllerGetTransaksi,
    controllerBayarTransaksi,
    controllerDeleteTransaksi,
    controllerGetTransaksiBelumLunas,
    controllerGetTransaksiLunas
} = require("./transaksi.controller");

const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation")

router.post("/add", checkToken, controllerAddTransaksi);
router.get("/", checkToken, controllerGetTransaksi);
router.get("/belum_lunas", checkToken, controllerGetTransaksiBelumLunas);
router.get("/lunas", checkToken, controllerGetTransaksiLunas);
router.patch("/bayar", checkToken, controllerBayarTransaksi);
router.delete("/", checkToken, controllerDeleteTransaksi);



module.exports = router;
