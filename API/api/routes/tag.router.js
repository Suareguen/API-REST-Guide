const router = require('express').Router()

const {
  getAllTags,
  getOneTag,
  updateTag,
  createTag,
  deleteTag,
} = require('../controllers/tag.controller.js')

router.get('/', getAllTags)
router.get('/:id', getOneTag)
router.post('/', createTag)
router.put('/:id', updateTag)
router.delete('/:id', deleteTag)

module.exports = router
