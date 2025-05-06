import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Button from './Button/Button.js';
import { getRandomElement } from './All_Elements.js';
import GameStatusPopup from './GameStatusPopup.js';
import { clearElements } from './GameScreen.js';
import { Element_Player_Num } from './All_Elements.js';


// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)



const containsID = async (gameName) => {
  const { data, error } = await supabase
    .from('current_games')
    .select('*')
    .eq('game_name', gameName)
    .single()
  if(error){
      return false;
  }
  return data !== null;
}

export async function generateFiveDigitCode(){
  let listOfPossibleVals = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ];

  for(let i = 0; i < 100000; i++){ // Didn't want to put while true because just in case
    let result = "";
    for(let num = 0; num < 5; num++){
      let index = Math.floor(Math.random() * listOfPossibleVals.length);
      result += listOfPossibleVals[index];
    }
    console.log(result);
    if(!await containsID(result)){
      return result;
    }
  }
  return "-1";

  /*
  Code if we want no repeats in the Game Code

  for(let i = 0; i < 10000; i++){
    let indexToSwitch = len(listOfPossibleVals) - 1;
    let result = "";
    for(let num = 0; num < 5; num++){
      let index = Math.floor(Math.random() * (62 - num));
      result += listOfPossibleVals[index];
      let temp = listOfPossibleVals[index];
      listOfPossibleVals[index] = listOfPossibleVals[indexToSwitch];
      listOfPossibleVals[indexToSwitch] = temp;
      indexToSwitch--;
    }
    if(!containsID(result)){
      return result;
    } 
  }
  return "-1";
  */
}


const GameStateComponent = () => {
  const [gameState, setGameState] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [joinGameName, setJoinGameName] = useState('')
  const [createGameName, setCreateGameName] = useState('')
  const [currGameName, setCurrGameName] = useState('')
  const [playerNumber, setPlayerNumber] = useState(0)
  const [gameOver, setGameOver] = useState(null);

  const handleClosePopup = () => {
    setGameOver(null);
    setCurrGameName('');
    setPlayerNumber(0);
    setGameState(0);
    setJoinGameName('');
    
  }
  useEffect(() => {
    //this is what we want to do when things change (right now there's just a popup)
    const handleUpdates = (payload) => {
      console.log('AYO SOMETHING CHANGED BABYYY', payload)
        setGameState(payload.new)
        // console.log("PAYLOAD:")
        // console.log(payload)
        // setShowPopup(true)


        if (payload.new['winning_player'] != null) {
          if (payload.new['winning_player'] == playerNumber) {
            setGameOver(1);
          } else {
            setGameOver(0);
          }
        }
        
        // hide popup after 3 seconds
        setTimeout(() => {
          setShowPopup(false)
        }, 3000)
    }

    const subscription = supabase
      .channel('current_games')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE',  //listening for any sort of update
          schema: 'public', //its public woohoo
          table: 'current_games', //the table is called current_games
          filter: `game_name=eq.${currGameName}` //(only look at the row where the game_name is the one we're playing)
        },
        handleUpdates
      )
      .subscribe() //subscribes (always listens)to the channel

    // gets the initial state, should always be 0 (uness the game is already going!).  Simple api call
    const fetchInitialState = async () => {
      const { data, error } = await supabase
        .from('current_games')
        .select('*')
        .eq('game_name', currGameName)
        .single()

        if (data) {
          setGameState(data['gamestate']);
        }
          console.log('gamestate', gameState);

    }

    fetchInitialState()
    
    const handleBeforeUnload = async (event) => {
      console.log("unloading");
      //Gotta figure out how to make the user leave the game.  Will probably have a timeout feature using the realtime database
      /** 
      if (playerNumber == 1) {
        const { error } = await supabase
        .from('current_games')
        .update({'player_1' : 0})
        .eq('game_name', currGameName)
        
        if (error != null) {
          console.log("Error leaving game as player 1:");
          console.log(error);
        }
      } else if (playerNumber == 2) {
        const { error } = await supabase
        .from('current_games')
        .update({'player_2' : 0})
        .eq('game_name', currGameName)
        
        if (error != null) {
          console.log("Error leaving game as player 2:");
          console.log(error);
        }
        
      }
        */
      event.preventDefault();
    } 
    //handles when a page is unloaded
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      subscription.unsubscribe() //unsubscribe bc its over
    }

  }, [currGameName, gameState]) //makes currGameName and gameState reload ts

  //ts updates the gamestate.  Right now its just a button to end the game but obviously we would change it to be when someone reaches the desired element
  const handleGameToggle = async () => {
    try {
      const { data, error } = await supabase
        .from('current_games')
        .update({ gamestate: ((gameState+1)%3) }) //cycle gameState between 0,1,2,0,1,2, etc.
        .eq('game_name', currGameName)

      setGameState((gameState+1)%3); //and keep track of it locally, ofc
      if (error) {
        console.error('gamestate ain\'t changing:', error)
      }
    } catch (error) {
      console.log('Error changing gamestate:');
      console.log(error);
    }
  }


  //updates join game text box as user types
  const handleJoinGameNameChange = (event) => {
    setJoinGameName(event.target.value);
  }

  //adds the user to an existing game as player 1 or 2, whichever is not taken (prioritizing player 1)
  const handleJoinGameNameSubmit = async () => {
    console.log('joining a game');

    //checks if the target game exists
    const { data, error } = await supabase
     .from('current_games')
     .select('*')
     .eq('game_name', joinGameName)
     .single()

    // console.log(data);
    if (data != null) { //the game was in the table
      if (data['player_1'] === true && data['player_2'] === true) { //already two players in the game
        console.log('oy butthead, this game is already full!')
      } else {
        if (data['player_1'] === false) { //if we're missing player one, make him player one
          
          const { error } = await supabase
          .from('current_games')
          .update({'player_1' : 1})
          .eq('game_name', joinGameName)
          
          if (error != null) {
            console.log("error joining as player_1:");
            console.log(error)
          } else {
            setPlayerNumber(1);
            Element_Player_Num(1);
            setCurrGameName(joinGameName);
          }
          
        } else if (data['player_2'] === false) { //else if we're missing player two, make him player two
          
          const { error } = await supabase
          .from('current_games')
          .update({'player_2' : 1})
          .eq('game_name', joinGameName)
          
          if (error != null) {
            console.log("error joining as player_1:");
            console.log(error);
          } else {
            setPlayerNumber(2);
            Element_Player_Num(2);
            setCurrGameName(joinGameName);
          }
        } else { //should never happen, was using to debug.
          console.log('how ...');
        }

      }
    } else { //the game wasn't in the table
      console.log("Oy dipshit, this game doesn't exist!")
    }
  }

  //updates create game text box as user types
  const handleCreateGameNameChange = (event) => {
    setCreateGameName(event.target.value);
  }

  const handleEndGame = async () => {

    console.log("Ending game");
    const { error } = await supabase
    .from('current_games')
    .delete()
    .eq('game_name', currGameName)
  }

  //creates a new game and makes the user player 1
  const handleCreateGameNameSubmit = async () => {
    console.log('Creating a game');

    const newName = await generateFiveDigitCode();
    setCreateGameName(newName);

    //checks if game exists
    const { data, error } = await supabase
    .from('current_games')
    .select('*')
    .eq('game_name', newName)
    .single()

    getRandomElement(newName)
    if (data != null) { //game already in table
      console.log("Oy butthead, this game already exists!  You can't make something that exists!");
    } else {
      const { error } = await supabase
      .from('current_games')
      .insert({ game_name: newName, player_1: 1})

      if (error != null) {
        console.log("Error creating a new game:");
        console.log(error);
      } else {
        setPlayerNumber(1);
        setCurrGameName(newName);
      }
    }


  }

  return (
    <div>
      {/* GameStatusPopup overlay for game over */}
      {gameOver !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <GameStatusPopup status={gameOver} onClose={handleClosePopup} />
        </div>
      )}
      <h1>Game State</h1>
      <p>Game Status: {gameState && String(gameState)}</p>
      <div>
        <input type="text" value={createGameName} onChange={handleCreateGameNameChange} />
        <button onClick={handleCreateGameNameSubmit}> Create Game </button>
      </div>
      <div>
        <input type="text" value={joinGameName} onChange={handleJoinGameNameChange} />
        <button onClick={handleJoinGameNameSubmit}> Join Game </button>
      </div>
      <button onClick={handleGameToggle}>
        Toggle Game
      </button>
      {/* added */}
      <button onClick={handleEndGame}> 
        End Game
      </button>
      {/* added */}
    </div>
  )
}

export default GameStateComponent
