import React from 'react'
import Moment from 'react-moment'
import moment from 'moment'

const FormateDate = (props) => {
    const nowday = + new Date().toISOString().split('T')[0].split('-')[2];
    const nowyear = + new Date().toISOString().split('T')[0].split('-')[0];
    const nowhour = + new Date().toISOString().split('T')[1].split(':')[0];
    const day = + props.children.split('T')[0].split('-')[2]
    const year = + props.children.split('T')[0].split('-')[0];
    const hour = + props.children.split('T')[1].split(':')[0];

    if (year === nowyear) {
        if (day === nowday)
            if (hour - nowhour > 12 || props.strict)
                if (props.strict)
                    return (<Moment format="HH:mm" >{props.children}</Moment>)
                else
                    return (
                        <React.Fragment>
                            Today{', '}
                            <Moment format="HH:mm" >{props.children}</Moment>
                        </React.Fragment>)
            else
                return (
                    <Moment fromNow>{props.children}</Moment>
                )
        else if (day === nowday - 1)
            return (
                <React.Fragment>
                    Yesterday{', '}
                    <Moment format="HH:mm">{props.children}</Moment>
                </React.Fragment>)

        else
            return (<Moment format="DD MMMM, HH:mm">{props.children}</Moment>)
    }
    else
        return (
            <Moment format="DD MMMM YYYY">{props.children}</Moment>
        )
}


export const formatDate = (timestamp) => {
    return moment(timestamp).format("h:mm A");
}

export default FormateDate;