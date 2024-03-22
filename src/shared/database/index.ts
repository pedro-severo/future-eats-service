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

    protected async insert(itemToAdd: any): Promise<void> {
        try {
            const { id } = itemToAdd;
            // istanbul ignore next
            await this.db?.doc(id)?.set({
                ...itemToAdd,
            });
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async update(id: string, itemToAdd: any): Promise<void> {
        try {
            await this.db.doc(id).update({
                ...itemToAdd,
            });
        } catch (e) {
            throw new Error(e.message);
        }
    }

    protected async insertSubCollectionItem(
        subCollection: string,
        mainItemId: string,
        itemToAdd: any
    ): Promise<void> {
        try {
            const { id } = itemToAdd;
            await this.db
                .doc(mainItemId)
                .collection(subCollection)
                .doc(id)
                .set({
                    ...itemToAdd,
                });
        } catch (e) {
            throw new Error(e.message);
        }
    }

    protected async checkDataExistenceByField(
        field: string,
        value: any
    ): Promise<boolean> {
        try {
            const snapshot = await this.db.where(`${field}`, '==', value).get();
            // istanbul ignore next
            return !snapshot?.empty;
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async checkDataExistence(id: string): Promise<boolean> {
        try {
            return (await this.db.doc(id).get()).exists;
        } catch (e) {
            throw new Error(e.message);
        }
    }

    protected async getDataByField(field: string, value: any): Promise<any> {
        try {
            const snapshot = await this.db.where(`${field}`, '==', value).get();
            const data: any[] = [];
            snapshot.forEach((doc) => {
                if (doc.data()) data.push(doc.data());
            });
            return data[0];
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async getData(id: string): Promise<any> {
        try {
            return (await this.db.doc(id).get()).data();
        } catch (e) {
            throw new Error(e.message);
        }
    }
}
