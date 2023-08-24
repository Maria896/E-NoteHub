import { getAllUsers } from "../controllers/user.js"
import express from 'express'
const router = express.Router()

router.get('/', getAllUsers);

export default router