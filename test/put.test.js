const request = require('supertest');
const server = require('../dist/index');

const basePathURL = 'qa-tests/put/json';
const baseURL = `/v1/db/${basePathURL}`;
const testData = {
    thirteen: 13, 
    pi: 3.14,
    string: 'simple text',
    subArray: [ 3.14, 'pi' ],
    subJson: { pi: 3.14 },
    zero: 0,
};
const putJSON = {
    path: 'qa-tests/put/json',
    value: testData,
};

describe('Test PUT requests', () => {

    beforeAll( async () => {
        const res = await request(server)
            .put('/v1/db')
            .send(putJSON);
        expect(res.status).toBe(201);
    });

    it('should contain all JSON data', async () => {
        let res = await request(server).get(baseURL);
        expect(res.text).toBe(JSON.stringify(testData, null, 2));

        res = await request(server).get(`${baseURL}/thirteen`);
        expect(res.text).toBe(testData.thirteen.toString());

        res = await request(server).get(`${baseURL}/pi`);
        expect(res.text).toBe(testData.pi.toString());

        res = await request(server).get(`${baseURL}/string`);
        expect(res.text).toBe(testData.string);

        res = await request(server).get(`${baseURL}/subArray`);
        expect(res.text).toBe(JSON.stringify(testData.subArray, null, 2));

        res = await request(server).get(`${baseURL}/subJson`);
        expect(res.text).toBe(JSON.stringify(testData.subJson, null, 2));

        res = await request(server).get(`${baseURL}/subJson/pi`);
        expect(res.text).toBe(testData.subJson.pi.toString());

        res = await request(server).get(`${baseURL}/zero`);
        expect(res.text).toBe(testData.zero.toString());
    });

    it('should update existing JSON data without destruction', async () => {
        await request(server)
            .put('/v1/db')
            .send({
                path: `${basePathURL}/zero`,
                value: 'modified!',
            })
            .expect(201);

        let res = await request(server).get(baseURL);
        expect(res.text).toBe(JSON.stringify({
            ...testData,
            zero: 'modified!'
        }, null, 2));

        await request(server)
            .put('/v1/db')
            .send({
                path: `${basePathURL}/subArray`,
                value: 'modified!',
            })
            .expect(201);
        res = await request(server).get(baseURL);
        expect(res.text).toBe(JSON.stringify({
            ...testData,
            subArray: 'modified!',
            zero: 'modified!',
        }, null, 2));

        await request(server)
            .put('/v1/db')
            .send({
                path: `${basePathURL}/subJson`,
                value: 'modified!',
            })
            .expect(201);
        res = await request(server).get(baseURL);
        expect(res.text).toBe(JSON.stringify({
            ...testData,
            subArray: 'modified!',
            subJson: 'modified!',
            zero: 'modified!',
        }, null, 2));

        await request(server)
            .put('/v1/db')
            .send({
                path: `${basePathURL}/string`,
                value: 'modified!',
            })
            .expect(201);
        res = await request(server).get(baseURL);
        expect(res.text).toBe(JSON.stringify({
            ...testData,
            string: 'modified!',
            subArray: 'modified!',
            subJson: 'modified!',
            zero: 'modified!',
        }, null, 2));
    });

    afterAll((done) => {
        server.close(done); // Close the server after tests are done
    });
});