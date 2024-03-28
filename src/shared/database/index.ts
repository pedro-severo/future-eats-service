import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { Service } from 'typedi';
import * as firebaseTesting from '@firebase/testing';

const serviceAccount = require('../../../../future-eats-service-5f069c811a09.json');

@Service()
export class DatabaseContext {
    db: FirebaseFirestore.Firestore;
    constructor() {
        initializeApp({
            credential: cert(serviceAccount),
        });
        this.db = getFirestore();
    }
    getContext(): FirebaseFirestore.Firestore {
        return this.db;
    }
}

export const projectId = 'future-eats-service';
@Service()
export class DatabaseTestContext {
    db: FirebaseFirestore.Firestore;
    constructor() {
        this.db = firebaseTesting
            .initializeTestApp({ projectId })
            .firestore() as unknown as FirebaseFirestore.Firestore;
    }
    getContext(): FirebaseFirestore.Firestore {
        return this.db;
    }
}

export abstract class Database {
    protected db: FirebaseFirestore.CollectionReference;

    constructor(context: FirebaseFirestore.Firestore) {
        this.db = context.collection(this.getCollectionName());
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
            // istanbul ignore next
            await this.db?.doc(id)?.update({
                ...itemToAdd,
            });
        } catch (e) {
            // istanbul ignore next
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
                // istanbul ignore next
                ?.doc(mainItemId)
                // istanbul ignore next
                ?.collection(subCollection)
                // istanbul ignore next
                ?.doc(id)
                // istanbul ignore next
                ?.set({
                    ...itemToAdd,
                });
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async checkDataExistenceByField(
        field: string,
        value: any
    ): Promise<boolean> {
        try {
            // istanbul ignore next
            const snapshot = await this.db
                ?.where(`${field}`, '==', value)
                ?.get();
            // istanbul ignore next
            return !snapshot?.empty;
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async checkDataExistence(id: string): Promise<boolean> {
        try {
            // istanbul ignore next
            return (await this.db?.doc(id)?.get())?.exists;
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async getDataByField(field: string, value: any): Promise<any> {
        try {
            // istanbul ignore next
            const snapshot = await this.db
                ?.where(`${field}`, '==', value)
                ?.get();
            const data: any[] = [];
            // istanbul ignore next
            snapshot?.forEach((doc) => {
                // istanbul ignore next
                if (doc?.data()) data.push(doc.data());
            });
            return data[0];
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }

    protected async getData(id: string): Promise<any> {
        try {
            // istanbul ignore next
            return (await this.db?.doc(id)?.get())?.data();
        } catch (e) {
            // istanbul ignore next
            throw new Error(e.message);
        }
    }
}
