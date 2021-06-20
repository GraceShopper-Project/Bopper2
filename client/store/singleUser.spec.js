import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  actionTypes,
  fetchUser,
  addToCart,
  removeFromCart,
} from "./singleUser";
import fetchMock from "fetch-mock";
import { expect } from "chai";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("singleUser", () => {
  describe("thunks", () => {
    afterEach(() => {
      fetchMock.restore();
    });
    describe("fetch user", () => {
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

    describe("add to cart", () => {
      it(`does not call fetch for unauthenticated users`, () => {
        global.window = {
          localStorage: {
            getItem: () => {},
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.ADD_TO_CART,
            productId: 1,
            quantity: 2,
          },
        ];

        const store = mockStore({ user: { cart: [] } });

        return store.dispatch(addToCart(1, 2)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions);
          expect(fetchMock.called()).to.equal(false);
        });
      });

      it(`reports changes to the backend for authenticated users`, () => {
        global.window = {
          localStorage: {
            getItem: () => "token",
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.ADD_TO_CART,
            productId: 1,
            quantity: 2,
          },
        ];

        const store = mockStore({ user: { cart: [] } });

        return store.dispatch(addToCart(1, 2)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions);
          expect(fetchMock.called()).to.equal(true);
        });
      });
    });

    describe("remove from cart", () => {
      it(`does not call fetch for unauthenticated users`, () => {
        global.window = {
          localStorage: {
            getItem: () => {},
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.REMOVE_FROM_CART,
            productId: 1,
          },
        ];

        const store = mockStore({ user: { cart: [{ id: 1 }] } });

        return store.dispatch(removeFromCart(1)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions);
          expect(fetchMock.called()).to.equal(false);
        });
      });

      it(`reports changes to the backend for authenticated users`, () => {
        global.window = {
          localStorage: {
            getItem: () => "token",
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.REMOVE_FROM_CART,
            productId: 1,
          },
        ];

        const store = mockStore({ user: { cart: [{ id: 1 }] } });

        return store.dispatch(removeFromCart(1)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions);
          expect(fetchMock.called()).to.equal(true);
        });
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
    it(`adds item to cart`, () => {
      expect(
        reducer(
          { cart: [] },
          {
            type: actionTypes.ADD_TO_CART,
            productId: 1,
            quantity: 2,
          }
        )
      ).to.deep.equal({ cart: [{ productId: 1, quantity: 2 }] });
    });
    it(`removes item to cart`, () => {
      expect(
        reducer(
          { cart: [{ id: 1 }, { id: 2 }] },
          {
            type: actionTypes.REMOVE_FROM_CART,
            productId: 1,
          }
        )
      ).to.deep.equal({ cart: [{ id: 2 }] });
    });
  });
});
