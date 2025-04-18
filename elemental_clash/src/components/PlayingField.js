import React, {useRef, useState, useEffect, useCallback} from 'react';
import Element from './Element';
import { getElementProduct } from './All_Elements';
import VerticalDivider from './Divider';

const PlayingField = ( { initElements } ) => {

    const elementRefs = useRef({}); //references to Element components storing elements (great naming scheme I know)
    const [elements, setElements] = useState([]); //Tracks active (combination) elements
    const [inventoryElements, setInventoryElements] = useState(initElements); //Tracks inventory elements

    /**
     * Takes the id of an element in elements as an argument
     * Uses 2D AABB collision detection based on each element's client bounding box
     * Returns a list of element IDs that are colliding (index 0 is the current element ID, index 1 is the element id that its colliding with)
     * Returns null if the currElementId is not in currRef
     */
    const checkCollision = useCallback((currElementId) => {
        const currRef = elementRefs.current[currElementId];
        if (!currRef) {
            console.log('ayo somethings broken in getting the DOM reference for checking collisions');
            return null;
        }

        const currrect = currRef.getBoundingClientRect(); //gets bounding box
        for (const otherId in elementRefs.current) { //for every element, check if their bounding boxes collide using 2D AABB
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

    /**
     * Called upon the release of an element
     * Arguments:
     * * id of the element
     * * startingPosition of the element (must have .x and .y)
     * * finalPosition of the leemnt (must have .x and .y)
     * * bool inventory that says whether or not it was an inventory element being dragged
     * If an inventory element was moved out of the inventory, adds a new element of the same name to 'elements' and moves the inventory element back
     * If regular element, checks for collision.  If there's a collision, removes both elements from elements and adds their product to elements
     */
    const handleDragStop = useCallback((id, startPos, finalPosition, inventory) => {
        setTimeout(() => {
            let workingId = id;
            console.log("WORKING ID 1: " + workingId);
            // setTimeout( () => {
            if (inventory) { //if its an inventory element that has left the inventory, make a new element in its new position
                const currRef = elementRefs.current[workingId];
                const rect = currRef.getBoundingClientRect();
                console.log(finalPosition.x);
                console.log(window.innerWidth * 0.3);
                if (finalPosition.x > window.innerWidth * 0.3) {
                    console.log("INVENTORY GANG BUT OVER HERE");
                    const newEle = inventoryElements.find(ele => ele.id == workingId);
                    workingId = `${newEle.name}-${Date.now()}`;
                    setElements(prevElements => {
                        console.log(newEle.name);
                        return prevElements.concat({id: workingId, name: newEle.name, position:{x: finalPosition.x, y: finalPosition.y}});
                    });
                    
                    console.log("INVENTORY GANG")
                    console.log(finalPosition)
                }
                // }, 0);
                console.log("WORKING ID 2: " + workingId);
            }

            const colliders = checkCollision(workingId);
            if (colliders) { //if there's a collision...
                const [ele1Id, ele2Id] = colliders;
                setElements(prevElements => {
                    const ele1 = prevElements.find(ele => ele.id == ele1Id); //get both elements in the collision
                    const ele2 = prevElements.find(ele => ele.id == ele2Id);
                    if (!(ele1 || ele2)) {
                        return prevElements;
                    } else {
                        //setIsLoading(true);  // Set loading to true before awaiting the promise
                        getElementProduct(ele1.name, ele2.name).then(newElement => { //wait for getElementProduct.  When it returns...
                            setElements(prevElements => {
                                //setIsLoading(false);  // Set loading to false after the promise resolves
                                console.log("A", prevElements);
                                return prevElements.filter(el => el.id != ele1Id && el.id != ele2Id).concat({ //remove the two old elements and add their product
                                    id: `${newElement}-${Date.now()}`,
                                    name: newElement,
                                    position: {x: (finalPosition.x+finalPosition.x)/2,
                                    y: (finalPosition.y+finalPosition.y)/2}
                                });
                            });

                            setInventoryElements(prevInventory => { //If the product element isn't in the inventory, add it
                                if (!prevInventory.find(ele => ele.name == newElement)) {
                                    return [...prevInventory, {id: `${newElement}-${Date.now()}`, name: newElement, position: {x: 0, y: 0}}];
                                } else {
                                    return prevInventory;
                                }
                            });
                            console.log("OVER HERE", inventoryElements);

                            
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
    }, [checkCollision, elements, inventoryElements]);

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'flex-start' }}>
            <div className='inventory'
                style={{
                    width: '30vw', //inventory takes up 1/3 of the screen
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, auto))', // Grid layout here
                    gap: '15px', // space between eles
                    paddingTop: '15px',
                    paddingLeft: '15px'
                }}
            >
                {inventoryElements.map((element) => (
                    <Element
                        key = {element.id}
                        id={element.id}
                        text={element.name}
                        position = {element.position}
                        onDragStop={handleDragStop}
                        inventory = {true}
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

            <VerticalDivider />

            <div className='active'>
                {elements.map((element) => (
                    <Element
                        key = {element.id}
                        id={element.id}
                        text={element.name}
                        position = {element.position}
                        onDragStop={handleDragStop}
                        inventory = {false}
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
        </div>
    );
};

export default PlayingField;
