import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require('../../../../future-eats-service-5f069c811a09.json');

export abstract class Database {
    protected db: FirebaseFirestore.Firestore;

    constructor() {
        initializeApp({
            credential: cert(serviceAccount)
        });
        this.db = getFirestore();
    }

    protected abstract getCollectionName(): string;

    async insert(itemToAdd: any) {
        try {
            const { id } = itemToAdd;
            await this.db.collection(this.getCollectionName()).doc(id).set({
                ...itemToAdd
            });
            return itemToAdd;
        } catch (e) {
            throw new Error("Error in insert query.");
        }
    }
}