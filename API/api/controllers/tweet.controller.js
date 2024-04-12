const Tweet = require('../models/tweet.model.js')

async function getAllTweets(req, res) {
  try {
    const tweets = await Tweet.findAll({ paranoid: false })
    if (tweets) {
      return res.status(200).json(tweets)
    } else {
      return res.status(404).send('No tweets found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function getOneTweet(req, res) {
  try {
    const tweet = await Tweet.findByPk(req.params.id)
    if (tweet) {
      return res.status(200).json(user)
    } else {
      return res.status(404).send('Tweet not found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function createTweet(req, res) {
  try {
    const tweet = await Tweet.create({
      name: req.body.name,
    })
    return res.status(200).json({ message: 'Tweet created', tweet: tweet })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function updateTweet(req, res) {
  try {
    const [tweetExist, tweet] = await Tweet.update(req.body, {
      returning: true,
      where: {
        id: req.params.id,
      },
    })
    if (tweetExist !== 0) {
      return res.status(200).json({ message: 'Tweet updated', tweet: tweet })
    } else {
      return res.status(404).send('Tweet not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

async function deleteTweet(req, res) {
  try {
    const user = await Tweet.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (user) {
      return res.status(200).json('User deleted')
    } else {
      return res.status(404).send('User not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllTweets,
  getOneTweet,
  createTweet,
  updateTweet,
  deleteTweet,
}
