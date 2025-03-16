import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const GameStateComponent = () => {
  const [gameState, setGameState] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

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
      .channel('gamestate')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE',  //listening for any sort of update
          schema: 'public', //its public woohoo
          table: 'gamestate', //the table is called gamestate
          filter: 'id=eq.1' //(only look at the row where the id column is 1)
        },
        handleUpdates
      )
      .subscribe() //subscribes (always listens)to the channel

    // gets the initial state, should always be 0.  Simple api call
    const fetchInitialState = async () => {
      const { data, error } = await supabase
        .from('gamestate')
        .select('*')
        .eq('id', 1)
        .single()

        setGameState(data)

    }

    fetchInitialState()

    return () => {
      subscription.unsubscribe() //unsubscribe bc its over
    }
  }, [])

  //ts updates the gamestate.  Right now its just a button to end the game but obviously we would change it to be when someone reaches the desired element
  const handleGameToggle = async () => {
    try {
      const { data, error } = await supabase
        .from('gamestate')
        .update({ finished: !gameState.finished }) //(!gameState.finished) toggles whatever it is.  Easier to test than just ending it
        .eq('id', 1)

      if (error) {
        console.error('gamestate ain\'t changing:', error)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>Game State</h1>
      <p>Game Status: {gameState && String(gameState.finished)}</p>
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
