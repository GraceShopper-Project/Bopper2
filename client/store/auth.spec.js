/* global describe beforeEach afterEach it */

import {expect} from 'chai'
import {me, logout} from './auth'
import fetchMock from 'fetch-mock'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import history from '../history'

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)

describe('/auth', () => {
  let store

  const initialState = {user: {}}
  const fakeUser = {username: 'Cody'}

  beforeEach(() => {
    fetchMock.get('/auth/me', {
      status: 200,
      headers: { "content-type": "application/json" },
      body: fakeUser
    })

    //no browser available, we need to stub out localStorage
    global.window = {
      localStorage: {
        removeItem: () => {},
        getItem: () => {
          return 'some-token'
        },
        setItem: () => {}
      }
    }
    store = mockStore(initialState)
  })

  afterEach(() => {
    fetchMock.reset()
    store.clearActions()
  })

  describe('/me', () => {
    describe('with valid token', () => {
      it('eventually dispatches the SET_AUTH action', async () => {
        await store.dispatch(me())
        const actions = store.getActions()
        const target = actions.filter((a) => a.type === "SET_AUTH")[0]
        expect(target).to.be.ok
        expect(target.auth).to.be.deep.equal(fakeUser)
      })
    })

    describe('without valid token', () => {
      beforeEach(() => {
        global.window = {
          localStorage: {
            removeItem: () => {},
            getItem: () => {},
            setItem: () => {}
          }
        }
      })
      it('does not dispatch GET USER action', async () => {
        await store.dispatch(me())
        const actions = store.getActions()
        expect(actions.length).to.equal(0)
      })
    })
  })

  describe('/logout', () => {
    it('eventually dispatches the SET_AUTH action with an empty object', async () => {
      fetchMock.post('/auth/logout', { status: 204 })
      await store.dispatch(logout())
      const actions = store.getActions()
      const target = actions.filter((a) => a.type === "SET_AUTH")[0]
      expect(target).to.be.ok
      expect(history.location.pathname).to.be.equal('/login')
    })
  })
})
