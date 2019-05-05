import React from 'react';
import { Rectangle } from 'react-shapes';

export default function Block(props) {
    const highBlockHeight = props.highBlockHeight;
    const blockX = props.x;
    const lowBlockTop = props.lowBlockTop;
    const lowBlockHeight = props.lowBlockHeight;
    const transparent = 'rgba(255,255,255,0.01)';

    return (
        <div id="block" >
            <div className={'blocks'} style={{ left: blockX}}>
                <Rectangle width={180} fill={{ color: transparent }} height={highBlockHeight}/>
            </div>
            <div className={'blocksLower'} style={{ left: blockX, top: lowBlockTop}}>
                <Rectangle width={180} fill={{ color: transparent }} height={lowBlockHeight} />
            </div>
        </div>
    );
}
