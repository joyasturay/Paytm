import PropTypes from 'prop-types';
export function Subheading({label}){
    return(
        <div className="text-sm  pt-4">
            {label}
        </div>
    )
}
Subheading.propTypes = {
    label: PropTypes.string.isRequired
};