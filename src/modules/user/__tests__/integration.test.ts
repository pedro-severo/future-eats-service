import './mocks/mockServer';
export const projectId = 'future-eats-service';

describe('Integration tests', () => {
    // afterAll(async () => {
    //     await firebaseTesting.clearFirestoreData({ projectId });
    //     await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
    // });

    it('should test login endpoint', () => {
        expect(true).toBe(true);
    });
});
