import PropTypes from 'prop-types';

export function Heading({label}){
    return(
        <div className="text-4xl font-bold pt-4">
            {label}
        </div>
    )
}

Heading.propTypes = {
    label: PropTypes.string.isRequired
};