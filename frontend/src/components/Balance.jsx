import PropTypes from 'prop-types';

export const Balance = ({ value }) => {
    return <div className="flex">
        <div className="font-bold text-lg">
            Your balance
        </div>
        <div className="font-semibold ml-4 text-lg">
            Rs {value}
        </div>
    </div>
}

Balance.propTypes = {
    value: PropTypes.number.isRequired  // Changed from string to number
};