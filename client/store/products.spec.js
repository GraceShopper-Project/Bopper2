import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import reducer, {GET_PRODUCTS, getProducts} from './products'
import fetchMock from 'fetch-mock'
import { expect } from 'chai'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('products', () => {
    describe('getProducts thunk', () => {
        afterEach(() => {
            fetchMock.restore()
        })

        it(`creates ${GET_PRODUCTS} when fetching users has been done`, () => {
            fetchMock.getOnce('/api/products', {
                body: [{ name: 'blah', description: 'speaker', price:1999 }],
                headers: { 'content-type': 'application/json' }
            })

            const expectedActions = [
                { type: GET_PRODUCTS, products: [{ name: 'blah', description: 'speaker', price:1999 }] },
            ]

            const store = mockStore({ products: [] })

            return store.dispatch(getProducts()).then(() => {
                // return of async actions
                expect(store.getActions()).to.deep.equal(expectedActions)
            })
        })
    })
    
    describe('reducer', () => {
        it(`adds fetched data to state`, () => {
            expect(reducer([], {
                type: GET_PRODUCTS, 
                products: [{ name: 'speaker-test' }] 
            })).to.deep.equal([{ name: 'speaker-test' }])
        })
    })
})