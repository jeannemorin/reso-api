// routes/contentRoutes.js

const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ContentController.getAllContents);
router.post('/', ContentController.createContent);

router.get('/:id', ContentController.getContentById);
router.put('/:id', ContentController.updateContent);
router.delete('/:id', ContentController.deleteContent);

router.get('/category/:category',  ContentController.getContentByCategory);
router.get('/type/:type',  ContentController.getContentByType);
router.post('/search',  ContentController.searchContents);

module.exports = router;
