import React, {useRef, useState, useEffect, useCallback} from 'react';
import Element from './Element'




const PlayingField = ( { initElements } ) => {
    
    
    const elementRefs = useRef({});
    const [elements, setElements] = useState(initElements);

    const handleClick = () => {
        console.log("ASF");
    };

    const checkCollision = useCallback((currElementId) => {
        const currRef = elementRefs.current[currElementId];
        if (!currRef) {
            console.log('ayo somethings broken in getting the DOM reference for checking collisions');
            return null;
        }

        const currrect = currRef.getBoundingClientRect();
        for (const otherId in elementRefs.current) {
            if (otherId != currElementId) {
                const otherRef = elementRefs.current[otherId];
                if (otherRef) {
                    const otherrect = otherRef.getBoundingClientRect();
                    if (
                        currrect.left < otherrect.right &&
                        currrect.right > otherrect.left &&
                        currrect.top < otherrect.bottom &&
                        currrect.bottom > otherrect.top
                    ) {
                        console.log("WOOWEE WE GOT AN OVERLOP");
                        return [currElementId, otherId]
                    }

                } else {
                    console.log('ayo somethings broken in getting the DOM reference for checking collisions, but the second check');
                    return null;
                }
            }
        }
        return null;
    }, []);

    const handleDragStop = useCallback((id, finalPosition) => {
        setElements(prevElements => 
            prevElements.map(element =>
                element.id === id ? {...element, x: finalPosition.x, y: finalPosition.y } : element
            )
        );

        setTimeout(() => {
            const colliders = checkCollision(id);
            if (colliders) {
                const [ele1Id, ele2Id] = colliders;
                setElements(prevElements => {
                    
                    if (!prevElements.find(el => el.id == ele1Id) || !prevElements.find(el => el.id == ele2Id)) {
                        return prevElements;
                    } else {
                        return prevElements.filter(el => el.id != ele1Id && el.id != ele2Id).concat({id: `${prevElements.find(el => el.id == ele1Id).name}-${prevElements.find(el => el.id == ele2Id).name}-${Date.now()}`, name:`${prevElements.find(el => el.id == ele1Id).name}-${prevElements.find(el => el.id == ele2Id).name}`, x: 0, y:0})
                    }
                });
            }
        }, 0)
    }, [checkCollision]);

    return (
        <div>
            <button onClick={handleClick}>Add Element</button>
            {elements.map((element) => (
                <Element 
                key = {element.id}
                id={element.id}
                text={element.name} 
                onDragStop={handleDragStop}
                ref={domNode => {
                    if (domNode) {
                        elementRefs.current[element.id] = domNode;
                    } else {
                        delete elementRefs.current[element.id];
                    }
                }}
                />
            ))}
        </div>
    );
};

export default PlayingField;