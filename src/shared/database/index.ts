import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require('../../../../future-eats-service-5f069c811a09.json');

export abstract class Database {
    protected db: FirebaseFirestore.CollectionReference;

    constructor() {
        initializeApp({
            credential: cert(serviceAccount),
        });
        this.db = getFirestore().collection(this.getCollectionName());
    }

    protected abstract getCollectionName(): string;

    async insert(itemToAdd: any) {
        try {
            const { id } = itemToAdd;
            await this.db.doc(id).set({
                ...itemToAdd,
            });
            return itemToAdd;
        } catch (e) {
            throw new Error('Error in insert query.');
        }
    }

    async checkDataExistence(field: string, value: any): Promise<boolean> {
        try {
            const snapshot = await this.db.where(`${field}`, '==', value).get();
            return !snapshot.empty;
        } catch (e) {
            throw new Error('Error in checkDataExistence query.');
        }
    }
}
