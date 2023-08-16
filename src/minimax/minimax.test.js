const {
  isMoveLeft,
  getWinner,
  isGameOver,
} = require('./minimax');

test('Return true if array length is more than 2', () => {
  expect(isMoveLeft(['1', '1', '0'])).toBe(true);
});

test('Return if the computer is winner', () => {
  expect(getWinner(['1', '1'], 'COMPUTER')).toBe(
    'Computer won'
  );
});

test('Return if the player is winner', () => {
  expect(getWinner(['1', '0'], 'COMPUTER')).toBe(
    'Player won!'
  );
});

test('Return if the player is winner', () => {
  expect(getWinner(['1', '1'], 'PLAYER')).toBe(
    'Player won!'
  );
});

test('Return if the game is over', () => {
  expect(isGameOver(['1', '1', '0'])).toBe(false);
});

test('Return if the game is over', () => {
  expect(isGameOver(['1', '1'])).toBe(true);
});
