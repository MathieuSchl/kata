/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the user
 *         balance:
 *           type: "integer"
 *           format: "int64"
 *           description: ballance of the account
 *       example:
 *         id: 212
 *         balance: 500
 */

/**
 * @swagger
 * tags:
 *   name: Account
 *   description: Everything about Account
 */

/**
 * @swagger
 * /account/{id}:
 *   get:
 *     summary: Get one account data
 *     tags: [Account]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of account"
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

module.exports.accountGetById = accountGetById;
async function accountGetById(data) {
  const idUserTarget = data.params ? data.params.id : undefined;
  // Id is not a number
  if (isNaN(idUserTarget)) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `SELECT i_id AS 'id', i_balance AS 'balance', i_idUser AS 'idUser' FROM account WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [idUserTarget]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  if (dbRes[1].length !== 1) {
    return {
      type: "code",
      code: 400,
    };
  }

  return {
    type: "json",
    code: 200,
    json: dbRes[1][0],
  };
}

/**
 * @swagger
 * /account/:
 *   post:
 *     summary: Create new employee
 *     tags: [Account]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     requestBody:
 *       description: "Create new account"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            properties:
 *              id:
 *                type: "integer"
 *                format: "int64"
 *                description: Id of the user
 *     responses:
 *       200:
 *         description: Get one employee data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
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

module.exports.accountPost = accountPost;
async function accountPost(data) {
  if (!data.body || !data.body.id) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `INSERT INTO account (i_balance, i_idUser) VALUES ('0', ?);`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.body.id]);
  if (dbRes[0]) {
    if (dbRes[0].errno === 1452) {
      return {
        type: "code",
        code: 401,
      };
      /* c8 ignore start */
    }
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  return {
    type: "code",
    code: 204,
  };
}

/**
 * @swagger
 * /account/{id}:
 *   delete:
 *     summary: Delete one employee
 *     tags: [Account]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of the users"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     responses:
 *       200:
 *        description: "Suppression succed"
 *       204:
 *        description: "No employee deleted"
 *       400:
 *        description: "id is not valid"
 *       401:
 *        description: "The employee is unauthenticated"
 *       403:
 *        description: "The employee is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.accountDeleteById = accountDeleteById;
async function accountDeleteById(data) {
  const idUserTarget = data.params ? data.params.id : undefined;
  // Id is not a number
  if (isNaN(idUserTarget)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const queryUpdate = `DELETE FROM account WHERE i_id = ?`;
  const dbRes = await data.app.executeQuery(data.app.db, queryUpdate, [idUserTarget]);
  // The sql request has an error
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  // The response has no value
  if (dbRes[1].affectedRows !== 1) {
    return {
      type: "code",
      code: 204,
    };
  }
  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/v1/account/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await accountGetById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/v1/account/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/v1/account/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await accountPost(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/v1/account/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/v1/account/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await accountDeleteById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/v1/users/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
