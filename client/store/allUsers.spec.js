import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import reducer, {actionTypes, fetchUsers} from './allUsers'
import fetchMock from 'fetch-mock'
import { expect } from 'chai'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('AllUsers', () => {
    describe('fetchUsers thunk', () => {
        afterEach(() => {
            fetchMock.restore()
        })

        it(`creates ${actionTypes.SET_USERS} when fetching users has been done`, () => {
            fetchMock.getOnce('/api/users', {
                body: [{ username: 'blah', email: 'email@example.com' }],
                headers: { 'content-type': 'application/json' }
            })

            const expectedActions = [
                { type: actionTypes.SET_USERS, users: [{ username: 'blah', email: 'email@example.com' }] },
            ]

            const store = mockStore({ allUsers: [] })

            return store.dispatch(fetchUsers()).then(() => {
                // return of async actions
                expect(store.getActions()).to.deep.equal(expectedActions)
            })
        })
    })
    
    describe('reducer', () => {
        it(`adds fetched data to state`, () => {
            expect(reducer([], {
                type: actionTypes.SET_USERS, 
                users: [{ username: 'bop' }] 
            })).to.deep.equal([{ username: 'bop' }])
        })
    })
})