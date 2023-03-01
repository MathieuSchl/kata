describe("GET /api/v1/users/", () => {
  test("200", async () => {
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
    const response = await require("../../api/user.js").userGetAll(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("json");
    expect(Object.keys(response.json).length).toBe(1);
    expect(response.json[0].id).toBe(1);
    expect(response.json[0].balance).toBe(0);
    expect(response.json[0].idUser).toBe(1);
  });
});

describe("GET /api/v1/users/:id", () => {
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
    const response = await require("../../api/user.js").usersGetById(data);

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
    const response = await require("../../api/user.js").usersGetById(data);

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
    const response = await require("../../api/user.js").usersGetById(data);

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
    const response = await require("../../api/user.js").usersGetById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/v1/users/", () => {
  test("200", async () => {
    const data = {
      body: { firstName: "test", lastName: "test", emailId: "test@test.com" },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPost(data);

    expect(response.code).toBe(204);
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
    const response = await require("../../api/user.js").usersPost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noFirstName", async () => {
    const data = {
      body: { lastName: "test", emailId: "test@test.com" },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noLastName", async () => {
    const data = {
      body: { firstName: "test", emailId: "test@test.com" },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPost(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noEmailId", async () => {
    const data = {
      body: { firstName: "test", lastName: "test" },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPost(data);

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
    const response = await require("../../api/user.js").usersDeleteById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noParams", async () => {
    const data = {
      app: {
        executeQuery: () => {
          return [null, { affectedRows: 1 }];
        },
      },
    };
    const response = await require("../../api/user.js").usersDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      params: {},
      app: {
        executeQuery: () => {
          return [null, { affectedRows: 1 }];
        },
      },
    };
    const response = await require("../../api/user.js").usersDeleteById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("204userNotExist", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, { affectedRows: 0 }];
        },
      },
    };
    const response = await require("../../api/user.js").usersDeleteById(data);

    expect(response.code).toBe(204);
    expect(response.type).toBe("code");
  });
});

describe("PUT /api/users/:id", () => {
  test("200", async () => {
    const data = {
      body: { firstName: "test", lastName: "test", emailId: "test@test.com" },
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPutById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("200noBody", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPutById(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      body: { firstName: "test", lastName: "test", emailId: "test@test.com" },
      app: {
        executeQuery: () => {
          return [null, []];
        },
      },
    };
    const response = await require("../../api/user.js").usersPutById(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});
