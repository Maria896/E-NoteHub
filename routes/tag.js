import { addTag,getAllTags,updateTag,deleteTag } from "../controllers/tag.js"
import express from 'express'
const router = express.Router()

router.post('/add-tag', addTag);
router.get('/', getAllTags);
router.put('/update-tag:id', updateTag);
router.delete('/delete-tag:id', deleteTag);


export default router;