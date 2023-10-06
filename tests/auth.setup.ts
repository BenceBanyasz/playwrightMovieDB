import {test as setup} from './fixtures/fixtures';

const authFile = 'playwright/.auth/user.json';

setup('authenticate',async ({authentication, page}) => {
    await authentication.login();
    await page.context().storageState({path: authFile});
})