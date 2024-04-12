const router = require('express').Router()

const {
  getAllTweets,
  getOneTweet,
  createTweet,
  updateTweet,
  deleteTweet,
} = require('../controllers/tweet.controller.js')

router.get('/', getAllTweets)
router.get('/:id', getOneTweet)
router.post('/', createTweet)
router.put('/:id', updateTweet)
router.delete('/:id', deleteTweet)

module.exports = router
