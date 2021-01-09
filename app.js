const gameContainer = document.querySelector('.game-container');
const gameFields = document.querySelectorAll('.field');

class TicTacToe {
  constructor(container, fields) {
    this.container = container;
    this.fields = fields;
    this.playerTurn = true;
    this.occupiedFields = [];
    this.playerFields = [];
    this.PCFields = [];
    this.detectPlayerClicks();
    this.detectRestart();
  }

  detectPlayerClicks() {
    this.container.addEventListener(
      'click',
      function (e) {
        if (
          !e.target.classList.contains('field') ||
          e.target.classList.contains('clicked') ||
          !this.playerTurn
        )
          return;

        const pickedPlayerFieldNum = +e.target.id.slice(-1);
        this.placeSymbol(pickedPlayerFieldNum);
      }.bind(this)
    );
  }

  detectRestart() {
    document.body.addEventListener(
      'click',
      function (e) {
        if (!e.target.classList.contains('btn--restart')) return;

        this.restartGame();
      }.bind(this)
    );
  }

  PCTurn() {
    const randomNum = this.pickRandomNum();

    if (this.occupiedFields.length >= 8) this.createEndgameModal('draw');
    else if (this.occupiedFields.includes(randomNum)) return this.PCTurn();
    else {
      setTimeout(() => this.placeSymbol(randomNum), 0);
    }
  }

  checkIfWinner(playerTurn) {
    const isWinner = playerTurn
      ? this.checkFields(this.playerFields)
      : this.checkFields(this.PCFields);
    if (!isWinner) return;
    this.declaredWinner = true;

    this.createEndgameModal(playerTurn);
  }

  checkFields(fieldsArr) {
    if (
      (fieldsArr.includes(1) &&
        fieldsArr.includes(2) &&
        fieldsArr.includes(3)) ||
      (fieldsArr.includes(4) &&
        fieldsArr.includes(5) &&
        fieldsArr.includes(6)) ||
      (fieldsArr.includes(7) &&
        fieldsArr.includes(8) &&
        fieldsArr.includes(9)) ||
      (fieldsArr.includes(1) &&
        fieldsArr.includes(4) &&
        fieldsArr.includes(7)) ||
      (fieldsArr.includes(2) &&
        fieldsArr.includes(5) &&
        fieldsArr.includes(8)) ||
      (fieldsArr.includes(3) &&
        fieldsArr.includes(6) &&
        fieldsArr.includes(9)) ||
      (fieldsArr.includes(1) &&
        fieldsArr.includes(5) &&
        fieldsArr.includes(9)) ||
      (fieldsArr.includes(3) && fieldsArr.includes(5) && fieldsArr.includes(7))
    )
      return true;
    else return false;
  }

  placeSymbol(fieldNum) {
    const field = document.querySelector(`#field-${fieldNum}`);
    const symbol = this.createSymbol();
    field.classList.add('clicked');
    field.append(symbol);

    this.occupiedFields.push(fieldNum);
    this.playerTurn
      ? this.playerFields.push(fieldNum)
      : this.PCFields.push(fieldNum);

    this.checkIfWinner(this.playerTurn);
    if (this.declaredWinner) return;

    this.playerTurn = !this.playerTurn;
    if (!this.playerTurn) this.PCTurn();
  }

  restartGame() {
    this.occupiedFields = [];
    this.playerFields = [];
    this.PCFields = [];
    this.playerTurn = true;
    this.declaredWinner = false;
    document.querySelector('.endgame-msg').remove();
    this.fields.forEach(field => {
      if (!field.classList.contains('clicked')) return;
      field.removeChild(field.firstChild);
      field.classList.remove('clicked');
    });
  }

  createSymbol() {
    const symbol = document.createElement('span');
    symbol.classList.add('symbol');
    this.playerTurn ? (symbol.textContent = 'X') : (symbol.textContent = 'O');
    return symbol;
  }

  createEndgameModal(playerTurn) {
    let endgameText;
    if (playerTurn === 'draw') endgameText = 'Draw!';
    else if (playerTurn) endgameText = 'Player wins!';
    else if (!playerTurn) endgameText = 'PC wins!';

    const endgameModal = document.createElement('div');
    endgameModal.classList.add('endgame-msg');
    endgameModal.innerHTML = `
    <p class="endgame-text">${endgameText}</p>
    <button class="btn--restart">Restart</button>
    `;
    document.body.append(endgameModal);
  }

  pickRandomNum() {
    return Math.floor(Math.random() * (9 - 1) + 1);
  }
}

const ticTacToe = new TicTacToe(gameContainer, gameFields);
