const documentsController = require("../controllers/documents.controller");

exports.commitSnapshot = async ({ doc_id, data }) => {
  const req = {
    params: { id: doc_id },
    body: data,
    query: {}
  };

  let result;
  const res = {
    status: () => res,
    json: (r) => { result = r; }
  };

  await documentsController.createOrUpdate(req, res);
  return result;
};
