import { Router } from "express";
import controlNome from "./controlers/control-nome.js";

const router = Router()

router.get('/users', controlNome.listarNome);


export default router;