import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// CREATE TABLE elements ( Will create in the .env file once I have access
//     element TEXT PRIMARY KEY, 
//     parentOne TEXT DEFAULT NULL,
//     parentTwo TEXT DEFAULT NULL
// );

function getElementProduct(parentOne, parentTwo){
    let element = getElementByParents(parentOne, parentTwo);
    let elementTwo = getElementByParents(parentTwo, parentOne);
    if(element == null && elementTwo == null){
        // Must calculate element using AI, and insert the data
        // return element from AI

        /*
            Allow Gemini, ChatGPT, etc generate the new element. 
            Let's call the new element "newElement"

            INSERT INTO elements (element, parentOne, parentTwo)
            VALUES (newElement, parentOne, parentTwo)
        */
    }
    if(element == null){
        return elementTwo;
    }
    return element;
}

const getElementByParents = async (parentOne, parentTwo) => {
    const { data, error } = await supabase
      .from('elements')
      .select('element')
      .eq('parentOne', parentOne)
      .eq('parentTwo', parentTwo)
      .single();
    
    if(data.element == null){
        return null;
    }
    return data.element;
};


