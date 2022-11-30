import React from 'react';
import PropTypes from 'prop-types';
import RandomNumber from './RandomNumber';
import {View, Text, StyleSheet, Button} from 'react-native';
import shuffle from 'lodash.shuffle';

class Game extends React.Component {
  // define types for the properties
  static propTypes = {
    randomNumberCount: PropTypes.number.isRequired,
    initialSeconds: PropTypes.number.isRequired,
    onPlayAgain: PropTypes.func.isRequired,
  };
  //initialized state of the selected numbers from the randomNumber
  state = {
    selectedIds: [],
    remainingSeconds: this.props.initialSeconds,
  };

  // create gameStatus instance as Playing
  gameStatus = 'PLAYING';

  // sets the state, based on what is selected
  selectNumber = numberIndex => {
    this.setState(prevState => {
      // spread function, copies original array, and then adding numberIndex, avoiding mutation
      return {selectedIds: [...prevState.selectedIds, numberIndex]};
    });
  };

  isNumberSelected = numberIndex => {
    return this.state.selectedIds.indexOf(numberIndex) >= 0;
  };

  // setup an array of a certain length, to create the selection of numbers, based on the prop
  // randomNumberCount (initially 6)
  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(
    () => 1 + Math.floor(10 * Math.random()),
  );

  // the target value, will be based on the sum of the first few elements of the randomNumbers array
  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  // TODO: shuffle random numbers

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  // once component mounts, lets start setting up the countdown.
  // we do this once its mounted bc we care about it
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        prevState => {
          return {remainingSeconds: prevState.remainingSeconds - 1};
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  // reset things. unmounting the component, and remount it
  // state will re-initialize, and timer will reset

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  // component will update is deprecated...
  // this was the code to cache information, basically letting us run gameStatus only when we need to (not every second)
  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (
      // when we recompute game status, we will do so based on next state
      nextState.selectedIds !== this.state.selectedIds ||
      nextState.remainingSeconds === 0
    ) {
      this.gameStatus = this.calcGameStatus(nextState);

      // when the game is NOT playing, clearInterval!! aka stop numbers
      if (this.gameStatus != 'PLAYING') {
        clearInterval(this.intervalId);
      }
    }
  }

  // compute gameStatus: Playing, won, lost
  calcGameStatus = nextState => {
    console.log('calcGameStatus');

    const sumSelected = nextState.selectedIds.reduce((acc, curr) => {
      return acc + this.shuffledRandomNumbers[curr];
    }, 0);
    if (nextState.remainingSeconds === 0) {
      return 'LOST';
    }
    if (sumSelected < this.target) {
      return 'PLAYING';
    }
    if (sumSelected === this.target) {
      return 'WON';
    }
    if (sumSelected > this.target) {
      return 'LOST';
    }
  };

  render() {
    const gameStatus = this.gameStatus;

    return (
      <View style={styles.container}>
        {/* dynamic/conditional styling, using the ${variable} */}
        <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>
          {this.target}
        </Text>

        {/* map thru the random numbers, that sum to the target */}
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((randomNumber, index) => (
            <RandomNumber
              key={index}
              number={randomNumber}
              id={index}
              isDisabled={
                this.isNumberSelected(index) || gameStatus !== 'PLAYING'
              }
              onPress={this.selectNumber}
            />
          ))}
        </View>
        {this.gameStatus !== 'PLAYING' && (
          <Button title="Play Again" onPress={this.props.onPlayAgain} />
        )}
        <Text style={styles.timer}>
          TimeLeft: {this.state.remainingSeconds}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    flex: 1,
    paddingTop: 50,
  },
  target: {
    fontSize: 40,
    backgroundColor: '#aaa',
    marginHorizontal: 50,
    textAlign: 'center',
    margin: 60,
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  random: {
    backgroundColor: '#999',
    width: 100,
    marginHorizontal: 15,
    marginVertical: 25,
    fontSize: 35,
    textAlign: 'center',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
  timer: {
    textAlign: 'center',
    paddingBottom: 40,
  },
});
export default Game;
