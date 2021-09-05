import React from 'react'
import classes from './WaveVisualizer.module.css'
const WaveVisualizer = (props) => {
    return (
        <div className={classes.mainContainer}>
            <div className={classes.waveItem} style={{ height: `${props.soundActivity > 0.5 ? 20 * props.soundActivity : 15 * props.soundActivity || 4}px`, borderRadius: props.soundActivity ? '2px' : '50%' }}>

            </div>
            <div className={classes.waveItem} style={{ height: `${30 * props.soundActivity || 4}px`, borderRadius: props.soundActivity ? '2px' : '50%', marginLeft: '3px', marginRight: '3px' }}>

            </div>
            <div className={classes.waveItem} style={{ height: `${props.soundActivity > 0.5 ? 20 * props.soundActivity : 15 * props.soundActivity || 4}px`, borderRadius: props.soundActivity ? '2px' : '50%' }}>

            </div>
        </div>
    )
}

export default WaveVisualizer
