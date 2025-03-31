import PropTypes from 'prop-types';

export function Button({label, onClick}) {
    return (
        <button 
            onClick={onClick}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
        >
            {label}
        </button>
    )
}

Button.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
};