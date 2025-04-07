import React, {useRef, useState, useEffect} from 'react';
import Draggable from 'react-draggable';
import Element from './Element'




const PlayingField = ( { initElements } ) => {


    const nodeRef = useRef(null);
    const [elements, setElements] = useState(initElements);

    const handleClick = () => {
        console.log("ASF");
    };

    const checkCollision = (element) => {
        /** 
        for (let element of elements) {
            if (element.id !== id) {
                const distance = Math.sqrt(Math.pow(newX - element.x, 2) + Math.pow(newY - element.y, 2));
                if (distance < 50) {
                    console.log(`collision between dragged ${elements[id-1].name} and ${element.name}`)
                    return true;
                }
            }
        }
        return false;
        */
    //     const rect = document.getElementById(`element-${element.id}`).getBoundingClientRect();
    //     console.log(rect);
    //    for (let curr of elements) {
    //     if (curr !== element) {
    //         const currrect = document.getElementById(`element-${curr.id}`).getBoundingClientRect();
    //         if (
    //             (rect.left < currrect.left && rect.right > currrect.left && rect.bottom > currrect.bottom && rect.top < currrect.bottom) ||
    //             (rect.left < currrect.left && rect.right > currrect.left && rect.bottom > currrect.top && rect.top < currrect.top) ||
    //             (rect.left < currrect.right && rect.right > currrect.right &&  rect.bottom > currrect.bottom && rect.top < currrect.bottom) ||
    //             (rect.left < currrect.right && rect.right > currrect.right && rect.bottom > currrect.top && rect.top < currrect.top)
    //         ) {
    //             console.log("Darn");
    //         }  else {
    //             console.log("bozo");
    //         }
    //     }
    //    }
    };

    const handleDrag = (e, data, id) => {
        const {x, y} = data;
        if (checkCollision(elements[id-1])) {
            console.log("collision!");
        }

        setElements(prevElements => 
            prevElements.map(element =>
                element.id === id ? { ...element, x, y } : element
            )
        );
    };

    return (
        <div>
            <button onClick={handleClick}>Add Element</button>
            {elements.map((element) => (
                <div id={`element-${element.id}`} style={{display: 'inline-block'}}>
                    <Draggable 
                        nodeRef={nodeRef}
                        key={element.id}
                        position={{x: element.x, y: element.y}}
                        onDrag={(e, data) => handleDrag(e, data, element.id)}
                    >
                        <div ref={nodeRef}>
                            <Element ref={nodeRef} text={element.name} />  
                        </div>
                    </Draggable>
                </div>
            ))}
        </div>
    );
};

export default PlayingField;