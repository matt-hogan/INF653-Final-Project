const stateParameterHandler = require("../middleware/stateParameterHandler");
const statesDB = require("../model/State");

const statesJSON = {
    states: require("../model/states.json"),
    setState: function (data, index) {
        this.states[index] = data;
    },
};


const getAllStates = async (req, res) => {
    const states = await statesDB.find();
    if (states) {
        states.forEach((state) => {
            if (state.funFacts) {
                const currentState = statesJSON.states.find(s => s.code === state.stateCode);
                statesJSON.setState({
                    ...currentState,
                    "funFacts": state.funFacts
                }, statesJSON.states.findIndex((s) => { if (s.code === state.stateCode) return true; }));
            }
        });
    }

    if (req.query.contig){
        if (req.query.contig.toLowerCase() === "true") {
            const filteredStates = statesJSON.states.filter((st) =>
                st.code !== "AK" && st.code !== "HI"
            );
            return res.json(filteredStates);
        } else if (req.query.contig.toLowerCase() === "false") {
            const filteredStates = statesJSON.states.filter((st) =>
                st.code === "AK" || st.code === "HI"
            );
            return res.json(filteredStates);
        }
    }

    return res.json(statesJSON.states);
}

const getState = async (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }

    const stateMongo = await statesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
    if (stateMongo) {
        const mergedState = { ...state, "funFacts": stateMongo.funFacts };
        return res.json(mergedState);
    }
    return res.json(state);
}

const getStateFunFact = async (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }

    const stateMongo = await statesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
    if (stateMongo && stateMongo.funFacts.length) {
        return res.json({
            "state": state.state,
            "funFact": stateMongo.funFacts[Math.floor(Math.random() * stateMongo.funFacts.length)]
        });
    }
    return res.status(404).json({ message: `No fun facts found for ${state.state}` });
}

const getStateCapital = (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    return res.json({
        "state": state.state,
        "captial": state.capital_city
    });
}

const getStateNickname = (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    return res.json({
        "state": state.state,
        "nickname": state.nickname
    });
}

const getStatePopulation = (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    return res.json({
        "state": state.state,
        "population": state.population
    });
}

const getStateAdmission = (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    return res.json({
        "state": state.state,
        "admitted": state.admission_date
    });
}


const postStateFunFact = async (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    if (!req.body.funfacts || !Array.isArray(req.body.funfacts)) {
        return res.status(400).json({ message: `State fun facts array value required` });
    }

    const stateMongo = await statesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
    const results = await statesDB.findOneAndUpdate(
        { stateCode: req.params.state.toUpperCase() },
        { funFacts: [ ... stateMongo ? stateMongo.funFacts : [], ...req.body.funfacts ] },
        { new: true, upsert: true }
    );
    return res.status(201).json(results);
}


const patchStateFunFact = async (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    if (!req.body.index) {
        return res.status(400).json({ message: `State fun fact index value required` });
    }
    if (!req.body.funfact) {
        return res.status(400).json({ message: `State fun fact value required` });
    }

    const stateMongo = await statesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
    if (!stateMongo) {
        return res.status(404).json({ message: `No fun facts found for ${state.state}` });
    } else if (!stateMongo.funFacts[req.body.index-1]) {
        return res.status(404).json({ message: `No fun fact found at the provided index for ${state.state}` });
    } else {
        stateMongo.funFacts[req.body.index-1] = req.body.funfact;
        const results = await statesDB.findOneAndUpdate(
            { stateCode: req.params.state.toUpperCase() },
            { funFacts: stateMongo.funFacts},
            { new: true }
        );
        return res.status(201).json(results);
    }
}

const deleteStateFunFact = async (req, res) => {
    const state = stateParameterHandler(req, res);
    if (res.headersSent) {
        return;
    }
    if (!req.body.index) {
        return res.status(400).json({ message: `State fun fact index value required` });
    }

    const stateMongo = await statesDB.findOne({ stateCode: req.params.state.toUpperCase() }).exec();
    if (!stateMongo) {
        return res.status(404).json({ message: `No fun facts found for ${state.state}` });
    } else if (!stateMongo.funFacts[req.body.index-1]) {
        return res.status(404).json({ message: `No fun fact found at the provided index for ${state.state}` });
    } else {
        stateMongo.funFacts.splice(req.body.index-1, 1);
        const results = await statesDB.findOneAndUpdate(
            { stateCode: req.params.state.toUpperCase() },
            { funFacts: stateMongo.funFacts},
            { new: true }
        );
        return res.status(201).json(results);
    }
}

module.exports = {
    getAllStates,
    getState,
    getStateFunFact,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission,
    postStateFunFact,
    patchStateFunFact,
    deleteStateFunFact
};