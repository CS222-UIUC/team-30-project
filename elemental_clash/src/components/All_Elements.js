import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import run from '../config/gemini'

// Your Supabase URL and anon key
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function getElementProduct(parentOne, parentTwo){
    try {
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
} catch (error) {
    console.log("error over here");
    return "oh well";
}
}

const getElementByParents = async (parentOne, parentTwo) => {
    try {
        const { data, error } = await supabase
        .from('elemental_combinations')
        .select('element_result')
        .eq('element_one', parentOne)
        .eq('element_two', parentTwo)
        .single();
        
        if(data["element_result"] == null){
            console.log("combination not in database");
            run(parentOne+parentTwo);

            let rowCount = 0; // this is your number

            const { data, er } = await supabase
                .rpc('get_row_count', { table_name_input: 'elemental_combinations' });

            if (er) {
                console.error('Error fetching column count:', error);
            } else {
                rowCount = data;
                console.log('Number of columns:', rowCount);
            }
            
            rowCount -= 1;


            const { error } = await supabase
                .from('elemental_combinations')
                .insert({ id: rowCount,element_one: parentOne, element_two:  parentTwo, element_result: 'Gemini Generated Element' });
            return null;
            
        }
        return data["element_result"];
    } catch (error) {
        console.error("err");
        return "failed element";
    }
};


