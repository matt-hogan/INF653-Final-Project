const statesJSON = require("../model/states.json");

const stateParameterHandler = (req, res) => {
    const state = statesJSON.find(
        (st) => st.code === req.params.state.toUpperCase()
    );
    if (!state) {
        return res.status(400).json({ message: `Invalid state abbreviation parameter` });
    }
    return state;
}

module.exports = stateParameterHandler;