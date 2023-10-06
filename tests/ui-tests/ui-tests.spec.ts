import { test } from "../fixtures/fixtures";
import labels from "./data/labels.json";

test.describe("unauthenticated UI tests for movieDB", () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ homePage }) => {
        await homePage.gotoMainPage();
    });

    test("movieDB user scenario tests with fixtures", async ({
        homePage,
        searchResultPage,
    }) => {
        await homePage.searchForTerm("Matrix");
        await searchResultPage.nthItemsTitleToBe(1, labels.matrix);
    });

    test("movieDB logo and login button should be visible in header", async ({
        homePage,
    }) => {
        await homePage.headerLogoToBeVisible();
        await homePage.toLoginPageToBeVisible();
    });
});

test.describe("authenticated UI tests for movieDB", () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.gotoMainPage();
    });

    test("movieDB user scenario tests with fixtures", async ({
        homePage,
        searchResultPage,
    }) => {
        await homePage.searchForTerm(labels.matrix);
        await searchResultPage.nthItemsTitleToBe(1, labels.matrix);
    });

    test("movieDB logo and userinfo button should be visible in header", async ({
        homePage,
    }) => {
        await homePage.headerLogoToBeVisible();
        await homePage.userInfoButtonToBeVisible();
    });
});
