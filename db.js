const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'trivia',
  password: '1234',
  max: 12,
  min: 2,
  idleTimeoutMillis: 3000,
  connectionTimeoutMillis: 2000
})

async function get_user(email) {
  const client = await pool.connect()

  const { rows } = await client.query({
    text: 'select * from users where email=$1',
    values: [email]
  })

  client.release()

  return rows[0]
}

async function create_user(name, email, password) {
  const client = await pool.connect()

  await client.query({
    text: 'insert into users (name, email, password) values ($1, $2, $3)',
    values: [name, email, password]
  })

  client.release()

}

async function create_useradmi(name, email, password) {
  const client = await pool.connect()

  await client.query({
    text: 'insert into users (name, email, password, es_admin) values ($1, $2, $3, $4)',
    values: [name, email, password, true]
  })

  client.release()

}

async function usuarios() {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: 'select * from users'
    /* rowMode:"array" */
  })
  client.release()
  return rows
}

async function create_question(preguntas, correcta, incorrecta1, incorrecta2 ) {
  const client = await pool.connect()

  await client.query({
    text: 'insert into questions (question, answer, fake1, fake2) values ($1, $2, $3, $4)',
    values: [preguntas, correcta, incorrecta1, incorrecta2 ]
  })
  client.release()
}

async function get_questions() {
  const client = await pool.connect()
  const { rows } = await client.query({
    text: 'select * from questions order by random() limit 3 ',
    //rowMode:"array"
  })
  client.release()
  return rows
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}



module.exports = {
  get_user, create_user, usuarios, create_useradmi, create_question, get_questions, shuffle
}
