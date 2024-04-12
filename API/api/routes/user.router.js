const router = require('express').Router()
const { getAllUsers, getOneUser, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js')
const { checkAuth, checkAdmin } = require('../middlewares/auth.js')

// Añadimos nuestro middleware antes de que se ejecute nuestro controlador, si todo va bien podremos acceder a nuestro recurso, em caso contrario no nos dejará
router.get('/', checkAuth, checkAdmin, getAllUsers)
router.get('/:id', checkAuth, getOneUser)
router.post('/', checkAuth, createUser)
router.put('/:id', checkAuth, updateUser)
router.delete('/:id', checkAuth, deleteUser)

module.exports = router
