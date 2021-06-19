import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, { actionTypes, fetchUser } from "./singleUser";
import fetchMock from "fetch-mock";
import { expect } from "chai";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("singleUser", () => {
  describe("fetchUser thunk", () => {
    afterEach(() => {
      fetchMock.restore();
    });

    it(`creates ${actionTypes.SET_USER} when fetching user has been done`, () => {
      global.window = {
        localStorage: {
          getItem: () => {
            return "some-token";
          },
        },
      };

      fetchMock.get("/api/users/1", {
        body: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          cart: [],
        },
        headers: { "content-type": "application/json" },
      });

      const expectedActions = [
        {
          type: actionTypes.SET_USER,
          user: {
            id: 1,
            username: "testuser",
            email: "test@example.com",
            cart: [],
          },
        },
      ];

      const store = mockStore({ user: {} });

      return store.dispatch(fetchUser(1)).then(() => {
        // return of async actions
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
    });
  });

  describe("reducer", () => {
    it(`adds fetched data to state`, () => {
      expect(
        reducer([], {
          type: actionTypes.SET_USER,
          user: [{ username: "bop" }],
        })
      ).to.deep.equal([{ username: "bop" }]);
    });
  });
});
