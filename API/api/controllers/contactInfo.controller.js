const ContactInfo = require('../models/contactInfo.model.js')

async function getAllContactsInfos(req, res) {
  try {
    const contactInfos = await ContactInfo.findAll({ paranoid: false })
    if (contactInfos) {
      return res.status(200).json(contactInfos)
    } else {
      return res.status(404).send('No contactInfos found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function getOneContactInfo(req, res) {
  try {
    const contactInfo = await ContactInfo.findByPk(req.params.id)
    if (contactInfo) {
      return res.status(200).json(user)
    } else {
      return res.status(404).send('cContactInfo not found')
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function createContactInfo(req, res) {
  try {
    const contactInfo = await ContactInfo.create({
      name: req.body.name,
    })
    return res.status(200).json({ message: 'ContactInfo created', contactInfo: contactInfo })
  } catch (error) {
    res.status(500).send(error.message)
  }
}

async function updateContactInfo(req, res) {
  try {
    const [contactInfoExist, contactInfo] = await ContactInfo.update(req.body, {
      returning: true,
      where: {
        id: req.params.id,
      },
    })
    if (contactInfoExist !== 0) {
      return res.status(200).json({ message: 'User updated', contactInfo: contactInfo })
    } else {
      return res.status(404).send('ContactInfo not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

async function deleteContactInfo(req, res) {
  try {
    const contactInfo = await ContactInfo.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (contactInfo) {
      return res.status(200).json('ContactInfo deleted')
    } else {
      return res.status(404).send('ContactInfo not found')
    }
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  getAllContactsInfos,
  getOneContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
}
