import React, {useState, useEffect, useCallback, forwardRef} from 'react';

const Element = forwardRef(( { text, id, position, onDragStop, inventory }, ref ) => {
    const [dragging, setDragging] = useState(false);
    const [currentPosition, setCurrentPosition] = useState({x: position?.x || 0, y: position?.y || 0});
    const [startPos, setStartPos] = useState({x: 0, y: 0});
    const [elementStartPos, setElementStartPos] = useState({x: position?.x || 0, y: position?.y || 0});

    /**
     * When the mouse is moved, if an element is currently being dragged, update its position based on the mouse movement
     */
    const handleMouseMove = useCallback((event) => {
        if (dragging) {
            const dx = event.clientX - startPos.x;
            const dy = event.clientY - startPos.y;
            setCurrentPosition({x: elementStartPos.x+dx, y: elementStartPos.y+dy});
        }
    }, [dragging, startPos, elementStartPos]);

    /**
     * When the mouse is pressed, if the mouse is over the element then save its starting position and set dragging to true
     */
    const handlePress = useCallback((event) => {
        event.preventDefault();
        const rect = event.currentTarget.getBoundingClientRect();
        setElementStartPos({
            x: rect.left,
            y: rect.top
        });
        setStartPos({x: event.clientX, y: event.clientY});
        setDragging(true);
        console.log(`it is ${dragging} that am dragging`)
    }, []);

    /**
     * When mouse is released, set dragging to false and update the element position accordingly (if its an inventory element, move it back, then call onDragStop either way)
     */
    const handleRelease = useCallback(() => {
        if (dragging) {
            setDragging(false);
            if (inventory) {
                setCurrentPosition({x: elementStartPos.x, y: elementStartPos.y});
            }
            if (onDragStop) {
                onDragStop(id, startPos, currentPosition, inventory);
            }
        }
        console.log(`${text} was released`)
        // setDragging(false);
        console.log(`it is ${dragging} that am dragging`)
    }, [dragging, id, onDragStop, currentPosition, inventory, elementStartPos, startPos]);

    /**
     * Enables controlling elements based on mouse clicks
     */
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleRelease);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleRelease);
        };
    }, [dragging, handleMouseMove, handleRelease]);

    const style = {
        position: (!inventory || dragging) ? 'absolute' : 'relative', //if its not in the inventory or its actively being moved, make the position absolute.  Otherwise, fit it in the grid
        left: (!inventory || dragging) ? `${currentPosition.x}px` : 'auto', //see position comment
        top: (!inventory || dragging) ? `${currentPosition.y}px` : 'auto', //see position comment
        display: 'inline-block',
        paddingTop: '1px',
        paddingBottom: '1px',
        paddingLeft: '15px',
        paddingRight: '15px',
        borderRadius: '12px',
        border: '2px solid',
        borderColor: '#ccc',
        backgroundColor: '#f0f0f0',
        color: '#333',
        fontSize: '16px',
        textAlign: 'center',
        cursor: dragging ? 'grabbing' : 'grab', //styling
        transition: dragging ? 'none' : 'transform .3s ease', //avoid goofy ah teleporting
        width: 'fit-content' //keeps the inventory elements from filling their columns
    };

    return (
        <div
        ref={ref}
        style={style}
        onMouseDown={handlePress}
        // onMouseUp={handleRelease}
        // onTouchStart={handlePress}
        // onTouchEnd={handleRelease}
        >{text}</div>
    );
});

export default Element;