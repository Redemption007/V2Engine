const mongoose = require('mongoose');
const Error = require('../modeles/error');

module.exports = client => {

    client.createError = async error => {
        const id = new mongoose.Types.ObjectId()
        const merged = Object.assign({_id: id}, error);
        const createError = await new Error(merged);

        await createError.save()
        return id
    }

    client.getError = async ID => {
        const data = await Error.findOne({_id: ID});

        if (data) return data;
    }
}
