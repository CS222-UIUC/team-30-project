import styles from './Button.module.css';
import {useState} from "react"
import { generateFiveDigitCode } from '../GameStateComponent';

function Button({ text = 'Test'}) {
    const [currentID, setNewID] = useState(text);
    const whenClicked = () => {
        console.log("HHHHHHHHHHHH");
        setNewID(generateFiveDigitCode());
    };

    return (
        <button 
            className={styles.button}
            onClick={whenClicked}
        >
            {currentID}
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