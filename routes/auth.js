const express = require('express')
const bcrypt = require('bcrypt')
const { get_user, create_user, usuarios, create_useradmi} = require('../db.js')

const router = express.Router()

router.get('/login', (req, res) => {
  const errors = req.flash('errors')
  res.render('login.html', { errors })
})

router.post('/login', async (req, res) => {
  // 0. Recuperamos los campos del formulario
  const email = req.body.email
  const password = req.body.password

  // 1. Revisamos si efectivamente existe el usuario
  const user_encontrado = await get_user(email)
  if (!user_encontrado) {
    req.flash('errors', 'Usuario inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }
  //  2. Revisamos que las contraseñas coincidan
  const son_iguales = await bcrypt.compare(password, user_encontrado.password)
  if (!son_iguales) {
    req.flash('errors', 'Usuario inexistente o contraseña incorrecta')
    return res.redirect('/login')
  }

  // 4. Guardamos al usuario en sesion
  req.session.user = user_encontrado

  // 3. Redirigir al usuario al Home
  res.redirect('/')
})

router.get('/register', (req, res) => {
  const errors = req.flash('errors')
  res.render('register.html', { errors })
})

router.post('/register', async (req, res) => {
  // 1. Recuperar los campos del formulario
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const password_confirm = req.body.password_confirm
  // 2. Validar que ambas contraseñas sean iguales
  if (password != password_confirm) {
    req.flash('errors', 'Las contraseñas no coinciden')
    return res.redirect('/register')
  }
  // 3. Validar que no exista otro usuario con el mismo correo
  const user = await get_user(email)
  if (user) {
    req.flash('errors', 'Este email ya se encuentra registrado')
    return res.redirect('/register')
  }
  //validamos si se ha creado algun usuario anterior
  let admin = await usuarios()
  const password_encrypt = await bcrypt.hash(password, 10)

  if(admin==""){
    await create_useradmi(name, email, password_encrypt )
  }
  else{
    await create_user(name, email, password_encrypt)
  }
  // 4. Finalmente podemos guardar el nuevo usuario en base de datos
  // 5. y en la sesión
  req.session.user = {
    name, email, password
  }

  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router
