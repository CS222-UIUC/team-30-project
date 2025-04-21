import styles from './Button.module.css';
import {useState} from "react"
import { generateFiveDigitCode } from '../GameStateComponent';

function Button({ text = 'Test', onClick, style }) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            style={style}
        >
            {text}
        </button>
    );
}

export default Button;

// function Button({ text = 'Test', onClick }) {
    
//     return (
//         <button 
//             className={styles.button}
//             onClick={onClick}
//         >
//             {text}
//         </button>
//     );
// }

// export default Button;