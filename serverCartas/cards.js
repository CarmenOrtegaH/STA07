
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}


function createDeck() {
  let deck = [];
  const palos = ['diamond', 'heart', 'club', 'spade'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

  for (let palo of palos) {
    for (let value of values) {
      deck.push([palo, value]);
    }
  }
  return deck;
}

function findHighestCard(turnCards) {
  return turnCards.reduce((prev, current) => {
    const currentCardValue = current.card ? current.card[1] : 0;
    const prevCardValue = prev.card ? prev.card[1] : 0;
    return currentCardValue > prevCardValue ? current : prev;
  });
}


module.exports = {
  createDeck,
  shuffleDeck,
  findHighestCard,
}