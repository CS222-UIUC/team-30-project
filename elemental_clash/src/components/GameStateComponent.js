import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const GameStateComponent = () => {
  const [gameState, setGameState] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [joinGameName, setJoinGameName] = useState('')
  const [createGameName, setCreateGameName] = useState('')
  const [currGameName, setCurrGameName] = useState('')
  const [playerNumber, setPlayerNumber] = useState(0)

  useEffect(() => {
    //this is what we want to do when things change (right now there's just a popup)
    const handleUpdates = (payload) => {
      console.log('AYO SOMETHING CHANGED BABYYY', payload)
        setGameState(payload.new)
        setShowPopup(true)
        
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

  //creates a new game and makes the user player 1
  const handleCreateGameNameSubmit = async () => {
    console.log('Creating a game');

    //checks if game exists
    const { data, error } = await supabase
    .from('current_games')
    .select('*')
    .eq('game_name', createGameName)
    .single()

    if (data != null) { //game already in table
      console.log("Oy butthead, this game already exists!  You can't make something that exists!");
    } else {
      const { error } = await supabase
      .from('current_games')
      .insert({ game_name: createGameName, player_1: 1})

      if (error != null) {
        console.log("Error creating a new game:");
        console.log(error);
      } else {
        setPlayerNumber(1);
        setCurrGameName(createGameName);
      }
    }
  }

  return (
    <div>
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
        End Game
      </button>

      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'black',
          color: 'white',
          padding: '20px 40px',
          borderRadius: '20px',
          fontSize: '24px',
        }}>
          Game Toggled!
        </div>
      )}
    </div>
  )
}

export default GameStateComponent
