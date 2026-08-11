import Dexie, { Table } from 'dexie';
import { SOS } from '@/types';

interface QueuedSOS extends Omit<SOS, 'id' | 'createdAt' | 'status'> {
    id?: number;
}

class DisasterDB extends Dexie {
    sosQueue!: Table<QueuedSOS>;

    constructor() {
        super('DisasterSOS');
        this.version(1).stores({
            sosQueue: '++id, userId, type',
        });
    }
}

export const db = new DisasterDB();