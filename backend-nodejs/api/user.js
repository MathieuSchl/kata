/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: "integer"
 *           format: "int64"
 *           description: Id of the employee
 *         firstName:
 *           type: "string"
 *           description: First name of the employee
 *         lastName:
 *           type: "string"
 *           description: Last name of the employee
 *         emailId:
 *           type: "string"
 *           description: Email of the employee
 *       example:
 *         id: 212
 *         firstName: John
 *         lastName: Doe
 *         emailId: john.doe@mailcom
 */

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Everything about user
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all user
 *     tags: [User]
 *     responses:
 *       "200":
 *         description: "Get all users data. Warning the returned users do not contain all the data"
 *         content:
 *           application/json:
 *             schema:
 *               type: "array"
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *        description: "The employee is unauthenticated"
 *       403:
 *        description: "The employee is not allowed"
 *       500:
 *        description: "Internal error with the request"
 */

module.exports.userGetAll = userGetAll;
async function userGetAll(data) {
  const querySelect = `SELECT i_id AS 'id', v_firstName AS 'firstName', v_lastName AS 'lastName', v_email AS 'emailId' FROM users;`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, []);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */
  return {
    type: "json",
    code: 200,
    json: dbRes[1],
  };
}

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get one employee data
 *     tags: [User]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of employee"
 *       required: true
 *       type: "integer"
 *       format: "int64"
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

module.exports.usersGetById = usersGetById;
async function usersGetById(data) {
  if (!data.params || !data.params.id) {
    return {
      type: "code",
      code: 400,
    };
  }
  const querySelect = `SELECT i_id AS 'id', v_firstName AS 'firstName', v_lastName AS 'lastName', v_email AS 'emailId' FROM users WHERE i_id = ?;`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.params.id]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
    return {
      type: "code",
      code: 500,
    };
  }
  /* c8 ignore stop */

  if (dbRes[1].length !== 1)
    return {
      type: "code",
      code: 400,
    };

  return {
    type: "json",
    code: 200,
    json: dbRes[1][0],
  };
}

/**
 * @swagger
 * /users/:
 *   post:
 *     summary: Create new employee
 *     tags: [User]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     requestBody:
 *       description: "Data to create employee"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Users'
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

module.exports.usersPost = usersPost;
async function usersPost(data) {
  if (!data.body || !data.body.firstName || !data.body.lastName || !data.body.emailId) {
    return {
      type: "code",
      code: 400,
    };
  }

  const querySelect = `INSERT INTO users ( v_firstName, v_lastName, v_email) VALUES (?, ?, ?);`;
  const dbRes = await data.app.executeQuery(data.app.db, querySelect, [
    data.body.firstName,
    data.body.lastName,
    data.body.emailId,
  ]);
  /* c8 ignore start */
  if (dbRes[0]) {
    console.log(dbRes[0]);
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
 * /users/{id}:
 *   delete:
 *     summary: Delete one employee
 *     tags: [User]
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

module.exports.usersDeleteById = usersDeleteById;
async function usersDeleteById(data) {
  const idUserTarget = data.params ? data.params.id : undefined;
  // Id is not a number
  if (isNaN(idUserTarget)) {
    return {
      type: "code",
      code: 400,
    };
  }
  const queryUpdate = `DELETE FROM users WHERE i_id = ?`;
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an employee
 *     tags: [User]
 *     consumes:
 *     - "application/x-www-form-urlencoded"
 *     parameters:
 *     - name: "id"
 *       in: "path"
 *       description: "Id of the users"
 *       required: true
 *       type: "integer"
 *       format: "int64"
 *     requestBody:
 *       description: "Data to update employee"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Users'
 *     responses:
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

module.exports.usersPutById = usersPutById;
async function usersPutById(data) {
  const idUserTarget = data.params ? data.params.id : undefined;
  // Id is not a number
  if (isNaN(idUserTarget)) {
    return {
      type: "code",
      code: 400,
    };
  }

  if (data.body && data.body.firstName) {
    const querySelect = `UPDATE users SET v_firstName = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.body.firstName, idUserTarget]);
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }

  if (data.body && data.body.lastName) {
    const querySelect = `UPDATE users SET v_lastName = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.body.lastName, idUserTarget]);
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }

  if (data.body && data.body.emailId) {
    const querySelect = `UPDATE users SET v_email = ? WHERE i_id = ?;`;
    const dbRes = await data.app.executeQuery(data.app.db, querySelect, [data.body.emailId, idUserTarget]);
    /* c8 ignore start */
    if (dbRes[0]) {
      console.log(dbRes[0]);
      return {
        type: "code",
        code: 500,
      };
    }
    /* c8 ignore stop */
  }

  return {
    type: "code",
    code: 200,
  };
}

/* c8 ignore start */
module.exports.startApi = startApi;
async function startApi(app) {
  app.get("/api/v1/users/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await userGetAll(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/v1/users/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.get("/api/v1/users/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await usersGetById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: GET /api/v1/users/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.post("/api/v1/users/", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await usersPost(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: POST /api/v1/users/");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.delete("/api/v1/users/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await usersDeleteById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: DELETE /api/v1/users/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });

  app.put("/api/v1/users/:id", async function (req, res) {
    try {
      const data = await require("../functions/apiActions").prepareData(app, req, res);
      const result = await usersPutById(data);
      await require("../functions/apiActions").sendResponse(req, res, result);
    } catch (error) {
      console.log("ERROR: PUT /api/users/:id");
      console.log(error);
      res.sendStatus(500);
    }
  });
}
/* c8 ignore stop */
