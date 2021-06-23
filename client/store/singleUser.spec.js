import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import reducer, {
  actionTypes,
  fetchUser,
  addToCart,
  removeFromCart,
  decrementQuantity,
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
      it(`uses only local storage for unauthenticated users`, () => {
        let getItemCalls = 0
        global.window = {
          localStorage: {
            getItem: (key) => {
              getItemCalls++
              switch (key) {
                case 'token':
                  return
                case 'CART':
                  return(JSON.stringify([]))
              }
            },
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.ADD_TO_CART,
            product: {},
            quantity: 2,
          },
        ];

        const store = mockStore({ user: { cart: [] } });

        return store.dispatch(addToCart({}, 2)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions, 'incorrect actions');
          expect(fetchMock.called()).to.equal(false, 'fetch was called');
          // only 1 because the get-cart call is missed by mocha -- it happens at load time, before test run time
          expect(getItemCalls).to.equal(1, 'token not checked')
        });
      });

      it(`reports changes to the backend for authenticated users`, () => {
        global.window = {
          localStorage: {
            getItem: (key) => {
              switch (key) {
                case "token":
                  return "token"
                case "CART":
                  return []
              }
            },
            setItem: () => {},
          },
        };

        fetchMock.mock("*", {});

        const expectedActions = [
          {
            type: actionTypes.ADD_TO_CART,
            product: {},
            quantity: 2,
          },
        ];

        const store = mockStore({ user: { cart: [] } });

        return store.dispatch(addToCart({}, 2)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions, "actions do not match");
          expect(fetchMock.called()).to.equal(true);
        });
      });
    });

    describe('decrementQuantity', () => {
      it('decrements quantity of item that exists in cart', () => {
        global.window = {
          localStorage: {
            getItem: () => 'token'
          }
        }

        fetchMock.put("/api/users/4/cart", {})
        
        const product = { id: 1, quantity: 2 }
        const store = mockStore({ user: {
          id: 4, 
          cart: [product] 
        } });

        const expectedActions = [
          {
            type: actionTypes.UPDATE_QUANTITY,
            productId: product.id,
            quantity: product.quantity - 1,
          }
        ]

        return store.dispatch(decrementQuantity(product)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions, "incorrect actions dispatched");
          expect(fetchMock.called()).to.equal(true, "fetch was not called");
        });
      })

      it('does nothing if item doesn\'t exist in cart', () => {
        global.window = {
          localStorage: {
            getItem: () => 'token'
          }
        }

        fetchMock.put("/api/users/4/cart", {})
        
        const product = { id: 1, quantity: 2 }
        const store = mockStore({ user: {
          id: 4, 
          cart: [] 
        } });

        const expectedActions = []

        return store.dispatch(decrementQuantity(product)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions, "incorrect actions dispatched");
          expect(fetchMock.called()).to.equal(false, "fetch was called");
        });
      })
    })

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

        const product = { id: 1 }
        const store = mockStore({ user: { cart: [ product ] } });

        return store.dispatch(removeFromCart(product)).then(() => {
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

        fetchMock.delete(`/api/users/1/cart/product/1`, {});

        const product = { id: 1 }
        const expectedActions = [
          {
            type: actionTypes.REMOVE_FROM_CART,
            productId: product.id,
          },
        ];
        const store = mockStore({ user: {id: 1, cart: [ product ] } });

        return store.dispatch(removeFromCart(product)).then(() => {
          // return of async actions
          expect(store.getActions()).to.deep.equal(expectedActions);
          expect(fetchMock.called()).to.equal(true);
        });
      });
    });
  });

  describe("reducer", () => {
    beforeEach(() => {
      global.window = {
        localStorage: {
          getItem: () => {},
          setItem: () => {},
        }
      }
    })

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
            product: {},
            quantity: 2,
          }
        )
      ).to.deep.equal({ cart: [{ quantity: 2 }] });
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
