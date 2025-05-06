import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import run from '../config/gemini'
import {clearInventory} from './Inventory.js';

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Variable to store the current target element
let currentTargetElement = null;
let gameName = null;
let PlayerNumber = null;

export function Element_Player_Num(num) {
    console.log("player number: " + num);
    PlayerNumber = num;

}

async function setDataWinner() {
    const { data: updatedRow, error: er } = await supabase
    .from('current_games')
    .update({ winning_player: PlayerNumber })
    .eq('game_name', gameName);
    if (er) {
        console.error("Error updating winning player:", er);
    } else {
        console.log("Successfully updated winning player to:", PlayerNumber);
    }
    
}

// Function to check if target is reached and display message
export function checkTargetReached(element) {
    if (currentTargetElement && element === currentTargetElement) {
        console.log("Target reached! Current player number:", PlayerNumber);
        setDataWinner();
        
        // Check if PlayerNumber is set
        if (PlayerNumber === null || PlayerNumber === undefined) {
            console.error("Player number not set when target reached");
            // Default to player 1 if not set, or handle as needed
            PlayerNumber = 1;
        }
        clearInventory();
        // Display message on screen
        const messageDiv = document.createElement('div');
        messageDiv.textContent = 'Target Reached!';
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '50%';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '20px';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.fontSize = '24px';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.zIndex = '1000';
        
        document.body.appendChild(messageDiv);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
        
        return true;
    }
    return false;
}

export async function getElementProduct(parentOne, parentTwo) {
    try {
    let element = await getElementByParents(parentOne, parentTwo);
    let elementTwo = await getElementByParents(parentTwo, parentOne);
    if(element == null && elementTwo == null){
        // Must calculate element using AI, and insert the data
        // return element from AI

        /*
            Allow Gemini, ChatGPT, etc generate the new element. 
            Let's call the new element "newElement"

            INSERT INTO elements (element, parentOne, parentTwo)
            VALUES (newElement, parentOne, parentTwo)
        */
            console.log("combination not in database");
            const result = await run(parentOne+"," +parentTwo);
            console.log("and the result is.." + result);

            const { error } = await supabase
                .from('elemental_combinations')
                .insert({element_1: parentOne, element_2:  parentTwo, element_result: result});
            element = result;
    }
    if(element == null){
        element = elementTwo;
    }
    
    // Check if the resulting element matches the target
    checkTargetReached(element);
    
    return element;
} catch (error) {
    console.log("error over here");
    return "oh well";
}
}

const getElementByParents = async (parentOne, parentTwo) => {
    if (parentOne == null || parentTwo == null){
        return null;
    }
    try {
        console.log("first log");
        const { data, error } = await supabase
        .from('elemental_combinations')
        .select('element_result')
        .eq('element_1', parentOne)
        .eq('element_2', parentTwo)
        .single();
        console.log("Result: ", data);
        console.log("second log");
        console.log("parent 1: " + parentOne);
        console.log("third log");
        
        if(data == null){

            return null;
            
        }
        console.log(data);
        return data["element_result"];
    } catch (error) {
        console.error("fukin error");
        return "failed element";
    }
};

export default getElementByParents;

export async function getRandomElement(name) {
    gameName = name;
  
    const { count, error: countError } = await supabase
      .from('elemental_combinations')
      .select('*', { head: true, count: 'exact' })
  
    if (countError) {
      console.error('Error counting elements:', countError);
      return null;
    }
  
    const randomIndex = Math.floor(Math.random() * count);
  
    const { data, error: fetchError } = await supabase
      .from('elemental_combinations')
      .select('element_result')
      .range(randomIndex, randomIndex)
      .single();
  
    if (fetchError) {
      console.error('Error fetching random element:', fetchError);
      return null;
    }

    // Update the global variable instead of creating a new local variable
    currentTargetElement = data.element_result;
    console.log("Target element: ", currentTargetElement);

    const { data: updatedRow, error: updateError } = await supabase
    .from('current_games')
    .update({ target_element: currentTargetElement })
    .eq('game_name', name);
    console.log("Target element: ", currentTargetElement);
    
    return data.element_result;
}


