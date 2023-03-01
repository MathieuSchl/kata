describe("POST /api/v1/account/add/:id/:amount", () => {
  test("200", async () => {
    const data = {
      params: { id: 1, amount: 10 },
      app: {
        executeQuery: () => {
          return [null, { changedRows: 1 }];
        },
      },
    };
    const response = await require("../../api/operation.js").postAdd(data);

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
    const response = await require("../../api/operation.js").postAdd(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noId", async () => {
    const data = {
      params: { amount: 10 },
      app: {
        executeQuery: () => {
          return [null, {}];
        },
      },
    };
    const response = await require("../../api/operation.js").postAdd(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("400noAmount", async () => {
    const data = {
      params: { id: 1 },
      app: {
        executeQuery: () => {
          return [null, {}];
        },
      },
    };
    const response = await require("../../api/operation.js").postAdd(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });

  test("401noAccountMatch", async () => {
    const data = {
      params: { id: 1, amount: 10 },
      app: {
        executeQuery: () => {
          return [null, { changedRows: 0 }];
        },
      },
    };
    const response = await require("../../api/operation.js").postAdd(data);

    expect(response.code).toBe(401);
    expect(response.type).toBe("code");
  });

  test("400invalidAmount", async () => {
    const data = {
      params: { id: 1, amount: 0 },
      app: {
        executeQuery: () => {
          return [null, { changedRows: 0 }];
        },
      },
    };
    const response = await require("../../api/operation.js").postAdd(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});

describe("POST /api/v1/account/withdraw/:id/:amount", () => {
  test("200", async () => {
    let queryNumber = 0;
    const data = {
      params: { id: 1, amount: 10 },
      app: {
        executeQuery: () => {
          queryNumber++;
          switch (queryNumber) {
            case 1:
              return [null, [{ balance: 50 }]];
              break;
            case 2:
              return [null, { changedRows: 1 }];
              break;

            default:
              return null;
              break;
          }
        },
      },
    };
    const response = await require("../../api/operation.js").postWithdraw(data);

    expect(response.code).toBe(200);
    expect(response.type).toBe("code");
  });

  test("400invalidAmount", async () => {
    let queryNumber = 0;
    const data = {
      params: { id: 1, amount: 0 },
      app: {
        executeQuery: () => {
          queryNumber++;
          switch (queryNumber) {
            case 1:
              return [null, [{ balance: 50 }]];
              break;
            case 2:
              return [null, { changedRows: 1 }];
              break;

            default:
              return null;
              break;
          }
        },
      },
    };
    const response = await require("../../api/operation.js").postWithdraw(data);

    expect(response.code).toBe(400);
    expect(response.type).toBe("code");
  });
});
