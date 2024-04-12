const router = require('express').Router()

const {
  getAllContactsInfos,
  getOneContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
} = require('../controllers/contactInfo.controller.js')

router.get('/', getAllContactsInfos)
router.get('/:id', getOneContactInfo)
router.post('/', createContactInfo)
router.put('/:id', updateContactInfo)
router.delete('/:id', deleteContactInfo)

module.exports = router
