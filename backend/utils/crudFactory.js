const createCrud = (Model, populateFields = "") => {
  const getAll = async (req, res) => {
    try {
      const query = Model.find(req.query.filter ? JSON.parse(req.query.filter) : {});
      if (populateFields) query.populate(populateFields);
      if (req.query.sort) query.sort(JSON.parse(req.query.sort));
      else query.sort("-createdAt");
      const docs = await query;
      res.json(docs);
    } catch (err) { res.status(500).json({ message: err.message }); }
  };
  const getOne = async (req, res) => {
    try {
      const query = Model.findById(req.params.id);
      if (populateFields) query.populate(populateFields);
      const doc = await query;
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    } catch (err) { res.status(500).json({ message: err.message }); }
  };
  const create = async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    } catch (err) { res.status(400).json({ message: err.message }); }
  };
  const update = async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json(doc);
    } catch (err) { res.status(400).json({ message: err.message }); }
  };
  const remove = async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
  };
  return { getAll, getOne, create, update, remove };
};
module.exports = createCrud;
