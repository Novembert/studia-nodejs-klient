const { create } = require('domain');
const net = require('net')

const client = new net.Socket();

let myBoard, opponentBoard

client.connect(8787, '127.0.0.1', () => {
  console.log('connected')
})

client.on('data', function(data) {
  setTimeout(async () => {console.log('Received: ' + data);
  let dataString = String(data)

  if (dataString.includes('NAME')) {
    await login()
    await resetBoards()
    await makeMove()
  }

  if (dataString.includes('WIN') || dataString.includes('LOST')) {
    await resetBoards()
  }

  if (dataString.includes('NEW GAME')) {
    await makeMove()
  }

  if (dataString.includes('OPPONENT')) {
    await handleOpponentMove(dataString)
    await makeMove()
  }
  
  if (dataString.includes('SUCCESS') || dataString.includes('FAILED')) {
    client.end();
  }}, 150)
	

});


const resetBoards = () => {
  myBoard = createArray(25)
  opponentBoard = createArray(25)
}

const createArray = (size, value = false) => {
  let arr = []
  for (i = 0; i < size; i++) {
    arr.push(value)
  }

  return arr
}

const login = async () => {
  await client.write('LOGIN s462068' + '\n')
}

const handleOpponentMove = async (data) => {
  const position = String(data).split(' ')[1]
  opponentBoard[Number(position)] = await true
}

const makeMove = async () => {
  let position = Math.floor(Math.random() * (25))
  while (myBoard[position] == true || opponentBoard[position] == true) {
    position = Math.floor(Math.random() * (25))
  } 
  await client.write('MOVE ' + position + '\n')
  myBoard[position] = true
}