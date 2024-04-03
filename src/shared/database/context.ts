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
