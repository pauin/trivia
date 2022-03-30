const express = require('express')
const fs = require('fs').promises
const { create_question, get_questions, shuffle } = require('../db.js')


const router = express.Router()

function protected_route (req, res, next) {
  if (!req.session.user) {
    // si quiere trabajar sin rutas prptegidas, comente la siguiente línea
    return res.redirect('/login')
  }
  next()
}

// RUTAS
router.get('/', protected_route, async(req, res) => {
  //const agendado= await get_agenda()
  const usuario = req.session.user.name
  const hospedador= req.body.usuario
  res.render('index.html', { usuario, hospedador})
})

router.post('/play', async (req, res) => {
  const usuario= req.body.usuario
  const pregunta= req.body.pregunta
  const respuesta1= req.body.respuesta1
  const respuesta2= req.body.respuesta2
  const respuesta3= req.body.respuesta3

  console.log(usuario);
  res.redirect('/')
});

router.get('/play', protected_route, async (req, res) => {
  const usuario = req.session.user.name
  let questions= await get_questions()
  let objeto=[]
  for (let question of questions){
    let array1=[]
    let obj={}
    array1.push(question.answer)
    array1.push(question.fake1)
    array1.push(question.fake2)
    shuffle(array1)
    obj={
      id:question.id,
      question: question.question,
      p1: array1[0],
      p2: array1[1],
      p3: array1[2]}
      objeto.push(obj)
  }
  res.render('play.html',{usuario, objeto})
})

router.get('/question', protected_route, async (req, res) => {
  const usuario = req.session.user.name
  res.render('question.html',{usuario} )
})

router.post('/question', protected_route, async (req, res) => {
  const preguntas= req.body.preguntas
  const correcta = req.body.correcta
  const incorrecta1 = req.body.incorrecta1
  const incorrecta2 = req.body.incorrecta2
  await create_question(preguntas, correcta, incorrecta1, incorrecta2)
  const usuario = req.session.user.name
  res.render('question.html',{usuario} )
})

module.exports = router
