import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import run from '../config/gemini'

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    }
    if(element == null){
        return elementTwo;
    }
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
            console.log("combination not in database");
            const result = await run(parentOne+"," +parentTwo);
            console.log("and the result is.." + result);

            const { error } = await supabase
                .from('elemental_combinations')
                .insert({element_1: parentOne, element_2:  parentTwo, element_result: result});
            return result;
            
        }
        console.log(data);
        return data["element_result"];
    } catch (error) {
        console.error("fukin error");
        return "failed element";
    }
};

export default getElementByParents;


