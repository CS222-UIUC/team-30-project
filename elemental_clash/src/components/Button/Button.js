import styles from './Button.module.css';

function Button({ text = 'Test', onClick }) {
    return (
        <button 
            className={styles.button}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;