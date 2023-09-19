import {APIResponse, expect} from '@playwright/test';
import {test} from '../fixtures/fixtures';
import {StatusCodes} from 'http-status-codes';
import {getSecrets} from '../authentication/retrieve-aws-creds-ci';
import * as labels from './data/labels.json'

test.describe('MovieDB api tests', () => {
    test('GET Details', async ({requestContext}) => {
        let response: APIResponse;

        await test.step('send GET request for Details', async () => {
            response = await requestContext.get(`/3/account/${labels.userId}`);
        });

        await test.step('should have 200 status code', async () => {
            expect(response.status()).toEqual(StatusCodes.OK);
        });

        await test.step('should have the correct username', async () => {
            const username = (await getSecrets()).username;
            const responseBody = await response.json();
            expect(responseBody.username).toEqual(username);
        });
    });

    test('POST Rating', async ({requestContext}) => {
        let response: APIResponse;

        await test.step('send POST request to add rating to Matrix', async () => {
            await requestContext.post(`/3/movie/${labels.movieId}/rating`, {data: {'value': labels.rating}});
        });

        await test.step('send GET request to return rated movies', async () => {
            response = await requestContext.get(`/3/account/${labels.userId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`);
        });

        await test.step('movie with id 555879 should have correct rating', async () => {
            const responseBody = await response.json();
            const resultsForRatings = responseBody.results;
            const ratingForMatrix = resultsForRatings.find(item => item.title === labels.matrix);
            expect(ratingForMatrix.rating).toEqual(labels.rating);
        });
    });

    test('DELETE Rating', async ({requestContext}) => {
        let response: APIResponse;

        await test.step('send DELETE request to remove rating from Matrix', async () => {
            await requestContext.delete(`/3/movie/${labels.movieId}/rating`);
        });

        await test.step('send GET request to return rated movies', async () => {
            response = await requestContext.get(`/3/account/${labels.userId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`);
        });

        await test.step('movie with id 555879 should not be present in list of rated movies', async () => {
            const responseBody = await response.json();
            const resultsForRatings = responseBody.results;
            const ratingForMatrix = resultsForRatings.find(item => item.title === labels.matrix);
            expect(ratingForMatrix).toBeUndefined();
        });
    })
});