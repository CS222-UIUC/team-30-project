import React, {useRef, useState, useEffect, useCallback} from 'react';
import Element from './Element'
import { getElementProduct } from './All_Elements';




const PlayingField = ( { initElements } ) => {
    
    
    const elementRefs = useRef({});
    const [elements, setElements] = useState(initElements);

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

    const handleDragStop = useCallback((id, startPos, finalPosition) => {
        // const elemen = elements.find(ele => ele.id == id);
        // if (!elemen) {
        //     return;
        // }
        // if (startPos.x <= window.innerWidth*.3 && finalPosition.x > window.innerWidth*.3) {
        //     console.log('inventory');
        //     // setElements(prevElements => {prevElements.concat({id: `${ele.name}-${Date.now()}`, name:`${ele.name}`, x: finalPosition.x, y:finalPosition.y})})
        //     const newElement = {id: `${elemen.name}-${Date.now()}`, name: `${elemen.name}`, x:elemen.x, y: elemen.y };
        //     setElements(prevElements => 
        //         prevElements.map(element =>
        //             element.id === id ? {...element, x: finalPosition.x, y: finalPosition.y } : element
        //         )
        //         .concat(newElement)
        //     );
        //     return;
        // }

        setTimeout(() => {
            const colliders = checkCollision(id);
            if (colliders) {
                const [ele1Id, ele2Id] = colliders;
                setElements(prevElements => {
                    const ele1 = prevElements.find(ele => ele.id == ele1Id);
                    const ele2 = prevElements.find(ele => ele.id == ele2Id);
                    if (!(ele1 || ele2)) {
                        return prevElements;
                    } else {
                        //setIsLoading(true);  // Set loading to true before awaiting the promise
                        getElementProduct(ele1.name, ele2.name).then(newElement => {
                            setElements(prevElements => {
                                //setIsLoading(false);  // Set loading to false after the promise resolves
                                return prevElements.filter(el => el.id != ele1Id && el.id != ele2Id).concat({
                                    id: `${newElement}-${Date.now()}`,
                                    name: newElement,
                                    x: 0,
                                    y: 0
                                });
                            });
                        }).catch(error => {
                            //setIsLoading(false);  // Set loading to false in case of an error
                            console.error("Error while getting element product:", error);
                        });
                        return prevElements;
                        
                        
                        // const new_element = getElementProduct(ele1.name, ele2.name);
                        // console.log("WHERE ARE UYOU");
                        // console.log("new_element: " + new_element);
                        // return prevElements.filter(el => el.id != ele1Id && el.id != ele2Id).concat({id: `${new_element}-${Date.now()}`, name:`${new_element}`, x: 0, y:0})
                        
                        //return prevElements.filter(el => el.id != ele1Id && el.id != ele2Id).concat({id: `${ele1.name}-${ele2.name}-${Date.now()}`, name:`${ele1.name}-${ele2.name}`, x: 0, y:0})
                    }
                });
            }
        }, 0)
    }, [checkCollision]);

    return (
        <div>
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