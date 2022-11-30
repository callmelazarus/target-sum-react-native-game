import React from 'react';

import {View, Text, StyleSheet} from 'react-native';

import Game from './Game';

class App extends React.Component {
  // change the gameId to unmount and remount the Game component (see key attribute)
  // changing the key of a component will unmount and remount it

  state = {
    gameId: 1,
  };

  // we are passing resetGame function down to Game, so that we can update the gameId state
  // which will inturn update the key attribute, and unmount/remount component
  resetGame = () => {
    this.setState(prevState => {
      return {gameId: prevState.gameId + 1};
    });
  };

  render() {
    return (
      <Game
        key={this.state.gameId}
        onPlayAgain={this.resetGame}
        randomNumberCount={6}
        initialSeconds={10}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
  },
});
export default App;
