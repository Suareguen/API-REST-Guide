const Tag = require('../models/tag.model.js')

async function getAllTags(req, res) {
  try {
    const tags = await Tag.findAll({ paranoid: false })
    if (tags) {
      return res.status(200).json(tags)
    } else {
      return res.status(404).send('No tags found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function getOneTag(req, res) {
  try {
    const tag = await Tag.findByPk(req.params.id)
    if (tag) {
      return res.status(200).json(tag)
    } else {
      return res.status(404).send('Tag not found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function createTag(req, res) {
  try {
    const tag = await Tag.create({
      name: req.body.name,
    })
    return res.status(200).json({ message: 'Tag created', tag: user })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function updateTag(req, res) {
  try {
    const [tagExist, tag] = await Tag.update(req.body, {
      returning: true,
      where: {
        id: req.params.id,
      },
    })
    if (tagExist !== 0) {
      return res.status(200).json({ message: 'Tag updated', tag: tag })
    } else {
      return res.status(404).send('Tag not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

async function deleteTag(req, res) {
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    })
    if (tag) {
      return res.status(200).json('Tag deleted')
    } else {
      return res.status(404).send('Tag not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllTags,
  getOneTag,
  updateTag,
  createTag,
  deleteTag,
}
