import React, { Component } from 'react';
import KeyHandler, { KEYPRESS } from 'react-key-handler';
import Block from './Blocks';
import Train from './Train';

const halfBird = 35; //half of bird's width
const innerHeight = window.innerHeight - 100;
const innerWidth = window.innerWidth;

const initialState = {
  score: 0,
  birdHeight: innerHeight - (innerHeight-150),
  left: 180,
  gravity: 0.9,
  velocity: 0,
  blockSpeed: 7,
  isHit: false,
  prevSpeed:0,
};

class App extends Component {

  static getInitialBlocks() {
    const count = 3;
    const blocks = [];
    for (let i = 1; i < count; i++) {
      const x = innerWidth/count + (innerWidth / i);
      blocks.push({
        highBlockHeight: (innerHeight / 2) - 100,
        lowBlockHeight: (innerHeight / 2) - 75,
        x: x,
      });
    }
    return blocks;
  }

  constructor(props) {
    super(props);
    this.state = initialState;
    this.state.blocks = App.getInitialBlocks();
    this.moveUp = this.moveUp.bind(this)
  }

  componentDidMount() {
    this.interval = setInterval(() => this.update(), 15);
    this.interval = setInterval(() => {
      if(Train(this.state.velocity, this.state.diffX, this.state.diffY, this.state.birdHeight, this.state.score, this.state.isHit))
        this.moveUp();
    }, 15);
  }

  update() {
    const birdCrashed = this.state.birdHeight > innerHeight - halfBird*3;
    const blockWasHit = this.state.blocks.find(block => block.isHit);

    if(blockWasHit || birdCrashed){

      // clearInterval(this.interval);
      // this.setState({
      //     isHit: true,
      // });
      // return;

      this.setState(initialState); //LOOP THE GAME TO TRAIN AUTOMATICALLY
      this.state.blocks=App.getInitialBlocks();
    }

    const newVelocity = (this.state.velocity + this.state.gravity) * 0.95;
    const birdHeight = newVelocity + this.state.birdHeight;
    const newBlocks = this.state.blocks.map(block => {
      const newX = block.x - this.state.blockSpeed;
      if (newX < -180) {
        let rand = Math.random()*330;
        return {
          highBlockHeight: (innerHeight/ 2) - rand,
          lowBlockHeight: (innerHeight/ 2) - 175 + rand,
          x: innerWidth - halfBird,
        }
      } else {
        let isHit = false;
        const xDifference = (this.state.left + halfBird*2 - block.x);
        this.state.diffX = xDifference;

        const upperY = block.highBlockHeight;
        const lowerY =  innerHeight - block.lowBlockHeight;
        this.state.diffY = this.state.birdHeight - (upperY+lowerY)/2;

        const hitOnX = xDifference < 180 && xDifference > 0;
        const hitOnUpperY = birdHeight < upperY;
        const hitOnLowerY = birdHeight + halfBird > lowerY;
        if ((hitOnUpperY || hitOnLowerY) && hitOnX) {
          isHit = true;
        }
        if(xDifference > 190 && xDifference < 198){
          this.setState({
            score: this.state.score + 1,
          });
        }

        return {
          ...block,
          x: newX,
          isHit: isHit
        }
      }
    });
    this.setState({
      prevSpeed: this.state.velocity,
      velocity: newVelocity,
      birdHeight: birdHeight,
      blocks: newBlocks
    });
  }

  moveUp(e) {
    this.setState({
      velocity: this.state.velocity - 25
    })
  }

  render() {
    const left = this.state.left;
    const birdHeight = this.state.birdHeight;
    const player = (this.state.velocity / this.state.prevSpeed > 0.99) ? 'playerdown' : 'playerup';
    if(!this.state.isHit)
      return (
          <div className="App" >
            <KeyHandler keyEventName={KEYPRESS} keyValue=" " onKeyHandle={this.moveUp} />
            <div style={{ left: left, top: birdHeight, position: 'absolute' }}>
              <div className={player}/>
            </div>
            {this.state.blocks.map(block => {
              const highBlockHeight = block.highBlockHeight;
              const x = block.x;

              const lowBlockTop = innerHeight - block.lowBlockHeight;
              const lowBlockHeight = block.lowBlockHeight;

              return <Block key={x} isHit={block.isHit} highBlockHeight={highBlockHeight} lowBlockHeight={lowBlockHeight} x={x} lowBlockTop={lowBlockTop} />
            })}
            <div className={'ground'}/>
            <div className={'score'}>
              <p>{`Score: ${this.state.score}`}</p>
            </div>
          </div>
      );
    else
      return (
          <div>
            <div className="App" >
              <div style={{ left: left, top: birdHeight, position: 'absolute' }}>
                <div className={player}/>
              </div>
              {this.state.blocks.map(block => {
                const highBlockHeight = block.highBlockHeight;
                const x = block.x;

                const lowBlockTop = innerHeight - block.lowBlockHeight;
                const lowBlockHeight = block.lowBlockHeight;

                return <Block key={x} isHit={block.isHit} highBlockHeight={highBlockHeight} lowBlockHeight={lowBlockHeight} x={x} lowBlockTop={lowBlockTop} />
              })}
              <div className={'groundPaused'}/>
              <div className={'gameOver'}>
                <p>GAME OVER</p>
                <p>Score: {this.state.score}</p>
              </div>
            </div>
          </div>
      );
  }
}

export default App;