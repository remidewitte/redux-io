import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
  LOAD_SUCCESS,
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  REMOVE_SUCCESS,
  OBJECT_CREATED,
  OBJECT_FETCHED,
  OBJECT_UPDATED,
  OBJECT_REMOVED,
  COLLECTION_FETCHED,
  COLLECTION_INVALIDATE,
  apiStateMiddleware,
} from '../src';
import { middlewareJsonApiSource } from '../src/middleware';

describe('Json api middleware', () => {
  let mockStore = configureMockStore([thunk, apiStateMiddleware]);
  const actionPromise = (action) => dispatch => {
    return new Promise((resolve) => {
      resolve();
    }).then(dispatch(action));
  };

  afterEach(() => {
    mockStore = configureMockStore([thunk, apiStateMiddleware]);
  });

  it('produces valid actions for fetch', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(4);

        const actionObjFetched = performedActions[0];
        expect(actionObjFetched.type).to.equal(OBJECT_FETCHED);
        expect(actionObjFetched.meta).to.deep.equal(expectedMeta);
        expect(actionObjFetched.payload).to.deep.equal(expectedPayload.data[0]);

        const actionCollFetched = performedActions[2];
        expect(actionCollFetched.type).to.equal(COLLECTION_FETCHED);
        expect(actionCollFetched.meta).to.deep.equal(expectedMeta);
        expect(actionCollFetched.payload).to.deep.equal(expectedPayload.data);

        const successAction = performedActions[3];
        expect(successAction.type).to.equal(LOAD_SUCCESS);

        expect(successAction.meta).to.deep.equal(expectedMeta);
        expect(successAction.payload).to.deep.equal(expectedPayload);
      }).then(done).catch(done);
  });

  it('produces valid actions for create', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }],
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: CREATE_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(3);

        const actionObjCreated = performedActions[0];
        expect(actionObjCreated.type).to.equal(OBJECT_CREATED);
        expect(actionObjCreated.meta).to.deep.equal(expectedMeta);
        expect(actionObjCreated.payload).to.deep.equal(expectedPayload.data[0]);

        const actionCollInvalidate = performedActions[1];
        expect(actionCollInvalidate.type).to.equal(COLLECTION_INVALIDATE);
        expect(actionCollInvalidate.meta).to.deep.equal({ ...expectedMeta, tag: '' });
        expect(actionCollInvalidate.payload).to.deep.equal(expectedPayload.data);

        const successAction = performedActions[2];
        expect(successAction.type).to.equal(CREATE_SUCCESS);

        expect(successAction.meta).to.deep.equal(expectedMeta);
        expect(successAction.payload).to.deep.equal(expectedPayload);
      }).then(done).catch(done);
  });

  it('produces valid actions for update', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }],
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: UPDATE_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(3);

        const actionObjUpdated = performedActions[0];
        expect(actionObjUpdated.type).to.equal(OBJECT_UPDATED);
        expect(actionObjUpdated.meta).to.deep.equal(expectedMeta);
        expect(actionObjUpdated.payload).to.deep.equal(expectedPayload.data[0]);

        const actionCollInvalidate = performedActions[1];
        expect(actionCollInvalidate.type).to.equal(COLLECTION_INVALIDATE);
        expect(actionCollInvalidate.meta).to.deep.equal({ ...expectedMeta, tag: '' });
        expect(actionCollInvalidate.payload).to.deep.equal(expectedPayload.data);

        const successAction = performedActions[2];
        expect(successAction.type).to.equal(UPDATE_SUCCESS);

        expect(successAction.meta).to.deep.equal(expectedMeta);
        expect(successAction.payload).to.deep.equal(expectedPayload);
    }).then(done).catch(done);
  });

  it('produces valid actions for delete', done => {
    const schema = 'schema_test';
    const deletedItem = {
      type: schema,
      id: '1',
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      item: deletedItem,
    };
    const mockSuccessAction = {
      type: REMOVE_SUCCESS,
      meta: expectedMeta,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(3);

        const actionObjDeleted = performedActions[0];
        expect(actionObjDeleted.type).to.equal(OBJECT_REMOVED);
        expect(actionObjDeleted.meta).to.deep.equal(expectedMeta);

        const actionCollInvalidate = performedActions[1];
        expect(actionCollInvalidate.type).to.equal(COLLECTION_INVALIDATE);
        expect(actionCollInvalidate.meta).to.deep.equal({ ...expectedMeta, tag: '' });

        const successAction = performedActions[2];
        expect(successAction.type).to.equal(REMOVE_SUCCESS);
        expect(successAction.meta).to.deep.equal(expectedMeta);
    }).then(done).catch(done);
  });

  it('produces valid actions for included data in payload', done => {
    const schema = 'schema_test';
    const includedSchema = 'included_schema';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [
        {
          type: schema,
          id: '1',
          attributes: {
            name: 'Test1',
          },
        }, {
          type: schema,
          id: '2',
          attributes: {
            name: 'Test2',
          },
        },
      ],
      included: [
        {
          type: includedSchema,
          id: '100',
          attributes: {
            name: 'Test100',
          },
        }, {
          type: includedSchema,
          id: '101',
          attributes: {
            name: 'Test101',
          },
        },
      ],
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(6);

        const actionObjIncludedFetched = performedActions[0];
        expect(actionObjIncludedFetched.type).to.equal(OBJECT_FETCHED);
        expect(actionObjIncludedFetched.meta).to.deep.equal({ ...expectedMeta, schema: includedSchema });
        expect(actionObjIncludedFetched.payload).to.deep.equal(expectedPayload.included[0]);

        const actionObjFetched = performedActions[2];
        expect(actionObjFetched.type).to.equal(OBJECT_FETCHED);
        expect(actionObjFetched.meta).to.deep.equal(expectedMeta);
        expect(actionObjFetched.payload).to.deep.equal(expectedPayload.data[0]);

        const actionCollFetched = performedActions[4];
        expect(actionCollFetched.type).to.equal(COLLECTION_FETCHED);
        expect(actionCollFetched.meta).to.deep.equal(expectedMeta);
        expect(actionCollFetched.payload).to.deep.equal(expectedPayload.data);

        const successAction = performedActions[5];
        expect(successAction.type).to.equal(LOAD_SUCCESS);

        expect(successAction.meta).to.deep.equal(expectedMeta);
        expect(successAction.payload).to.deep.equal(expectedPayload);
      }).then(done).catch(done);
  });

  it('ignores other actions', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };
    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: 'LOAD_SUCCESS',
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(1);

        const actionObjFetched = performedActions[0];
        expect(actionObjFetched.type).to.equal('LOAD_SUCCESS');
      }).then(done).catch(done);
  });

  it('ignores actions with other sources', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };
    const expectedMeta = {
      source: 'json',
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    store.dispatch(actionPromise(mockSuccessAction))
      .then(() => {
        const performedActions = store.getActions();
        expect(performedActions).to.have.length(1);

        const actionObjFetched = performedActions[0];
        expect(actionObjFetched.type).to.equal(LOAD_SUCCESS);
      }).then(done).catch(done);
  });

  it('throws exception if action doesn\'t have meta', done => {
    const schema = 'schema_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      payload: expectedPayload,
    };

    const store = mockStore({});
    expect(() => store.dispatch(actionPromise(mockSuccessAction))).to.throw('Meta is undefined.');
    done();
  });

  it('throws exception if action doesn\'t have source', done => {
    const schema = 'schema_test';
    const tag = 'tag_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };

    const expectedMeta = {
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    expect(() => store.dispatch(actionPromise(mockSuccessAction))).to.throw('Source is undefined.');
    done();
  });

  it('throws exception if action doesn\'t have schema', done => {
    const tag = 'tag_test';
    const schema = 'schema_test';
    const expectedPayload = {
      data: [{
        type: schema,
        id: '1',
        attributes: {
          name: 'Test1',
        },
      }, {
        type: schema,
        id: '2',
        attributes: {
          name: 'Test2',
        },
      }],
    };

    const expectedMeta = {
      source: middlewareJsonApiSource,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    expect(() => store.dispatch(actionPromise(mockSuccessAction))).to.throw('Schema is invalid.');
    done();
  });

  it('throws exception if action doesn\'t have payload with data property', done => {
    const tag = 'tag_test';
    const schema = 'schema_test';
    const expectedPayload = {};

    const expectedMeta = {
      source: middlewareJsonApiSource,
      schema,
      tag,
    };

    const mockSuccessAction = {
      type: LOAD_SUCCESS,
      meta: expectedMeta,
      payload: expectedPayload,
    };

    const store = mockStore({});
    expect(() => store.dispatch(actionPromise(mockSuccessAction))).to.throw('Payload Data is invalid, expecting payload.data.');
    done();
  });
});