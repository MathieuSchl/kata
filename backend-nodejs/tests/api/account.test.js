describe("GET /api/v1/account/:id", () => {
  test("200", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [
            null,
            [
              {
                id: 1,
                balance: 0,
                idUser: 1,
              },
            ],
          ];
        },
      },
    };
    const response = await require("../../api/account.js").accountGetById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(response.json.id).toBe(1);
    expect(response.json.balance).toBe(0);
    expect(response.json.idUser).toBe(1);
  });

  test("400noParams", async () => {
    const data = {
      app: {
        executeQuery: () => {
          return [
            null,
            [
              {
                id: 1,
                balance: 0,
                idUser: 1,
              },
            ],
          ];
        },
      },
    };
    const response = await require("../../api/account.js").accountGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      params: {},
      app: {
        executeQuery: () => {
          return [
            null,
            [
              {
                id: 1,
                balance: 0,
                idUser: 1,
              },
            ],
          ];
        },
      },
    };
    const response = await require("../../api/account.js").accountGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400userNotExist", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/account.js").accountGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/v1/account/", () => {
  test("200", async () => {
    const data = {
      body: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/account.js").accountPost(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });

  test("401userNotExist", async () => {
    const data = {
      body: { id: 1 },
      app: {
        executeQuery: () => {
          return [{ errno: 1452 }, []];
        },
      },
    };
    const response = await require("../../api/account.js").accountPost(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("400noBody", async () => {
    const data = {
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/account.js").accountPost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      body: {},
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/account.js").accountPost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("DELETE /api/v1/users/:id", () => {
  test("200", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, { affectedRows: 1 }];
        },
      },
    };
    const response = await require("../../api/account.js").accountDeleteById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    const data = {
      app: {
        executeQuery: () => {
          return [null, {}];
        },
      },
    };
    const response = await require("../../api/account.js").accountDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      params: {},
      app: {
        executeQuery: () => {
          return [null, {}];
        },
      },
    };
    const response = await require("../../api/account.js").accountDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("204UserNotExist", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, { affectedRows: 0 }];
        },
      },
    };
    const response = await require("../../api/account.js").accountDeleteById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});
