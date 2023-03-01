/**
 * @swagger
 * tags:
 *   name: Operation
 *   description: Everything about Account
 */

/**
 * @swagger
 * /account/add/{id}/{amount}:
 *   post:
 *     summary: Get one account data
 *     tags: [Operation]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of account"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: "amount"
 *       in: "path"
 *       description: "Amount of the operation"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: Get one account data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       204:
 *        description: "The request has no content"
 *       400:
 *        description: "id is not valid"
 *       401:
 *        description: "The employee is unauthenticated"
 *       403:
 *        description: "The employee is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postAdd = postAdd;
async function postAdd(data) {
  const id = data.params ? data.params.id : undefined;
  const amount = data.params ? data.params.amount : undefined;

  // Id is not a number
  if (isNaN(id) || isNaN(amount)) {
    return {
      type: "code",
      code: 400,
    };
  }

  if (amount <= 0) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `UPDATE account SET i_balance = i_balance + ? WHERE i_id = ?`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [amount, id]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  if (dbRes[1].changedRows !== 1) {
    return {
      type: "code",
      code: 401,
    };
  }

  return {
    type: "code",
    code: 200,
  };
}

/**
 * @swagger
 * /account/withdraw/{id}/{amount}:
 *   post:
 *     summary: Get one account data
 *     tags: [Operation]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of account"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     - name: "amount"
 *       in: "path"
 *       description: "Amount of the operation"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *         description: Get one account data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       204:
 *        description: "The request has no content"
 *       400:
 *        description: "id is not valid"
 *       401:
 *        description: "The employee is unauthenticated"
 *       403:
 *        description: "The employee is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.postWithdraw = postWithdraw;
async function postWithdraw(data) {
  const id = data.params.id;
  const amount = data.params.amount;

  if (amount <= 0) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `SELECT i_balance AS balance FROM account WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [id]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  if (dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 401,
    };
  }

  const balance = dbRes[1][0].balance;
  if (balance - amount <= 0) {
    return {
      type: "code",
      code: 401,
    };
  }

  const queryUpdate = `UPDATE account SET i_balance = i_balance - ? WHERE i_id = ?`;
  const dbResUpdate = await data.app.executeQuery(data.app.db, queryUpdate, [amount, id]);
  /* c8 ignore start */
  if (dbResUpdate[0]) {
    console.log(dbResUpdate[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.post("/api/v1/account/add/:id/:amount", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await postAdd(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/v1/account/add/:id/:amount");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/v1/account/withdraw/:id/:amount", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await postWithdraw(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/v1/account/withdraw/:id/:amount");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
