import * as firebaseTesting from '@firebase/testing';

describe('Integration tests', () => {
    let app;
    let db: firebaseTesting.firestore.Firestore;
    // TODO: protect projectId to don't up it to git hub and generate a random id to be registered on firebase SDK
    const projectId = 'future';

    beforeAll(async () => {
        app = await firebaseTesting.initializeTestApp({ projectId });
        db = await app.firestore();
    });

    afterAll(async () => {
        // await firebaseTesting.clearFirestoreData({ projectId });
        await Promise.all(firebaseTesting.apps().map((app) => app.delete()));
    });

    // TODO: integration tests. Remove example

    it('should insert data into Firestore', async () => {
        // Perform your integration test here
        const docRef = await db.collection('users').doc('documentId');
        await docRef.set({ foo: 'bar' });
        const snapshot = await docRef.get();
        expect(snapshot.data()).toEqual({ foo: 'bar' });
    });
});
