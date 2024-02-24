const save_data = async (model, query) => {
  try {
    let data_query = await model.create(query);
    return data_query;
  } catch (err) {
    throw err;
  }
};

const get_single_data = async (model, query, projection, options) => {
  try {
    let fetch_data = await model.findOne(query, projection, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const get_all_data = async (model, query, options) => {
  try {
    let fetch_data = await model.find(query, options);
    return fetch_data;
  } catch (err) {
    throw err;
  }
};

const get_one_update_one_data = async (model, query, update, option) => {
  try {
    let update_data = await model.findOneAndUpdate(query, update, option);
    return update_data;
  } catch (err) {
    throw err;
  }
};

const update_one_data = async (model, query, update) => {
  try {
    let update_data = await model.updateOne(query, update);
    return update_data;
  } catch (err) {
    throw err;
  }
};

const update_all_data = async (model, query, update) => {
  try {
    let update_data = await model.updateMany(query, update);
    return update_data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  save_data,
  get_single_data,
  get_all_data,
  get_one_update_one_data,
  update_one_data,
  update_all_data,
};
