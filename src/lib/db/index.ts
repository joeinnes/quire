import { SQLocalKysely } from 'sqlocal/kysely';
import { Kysely } from 'kysely';
import type { Database } from './types.ts';
import { Migrator } from 'kysely';
import { up, down } from './migrations/202502071725';

const { dialect, deleteDatabaseFile, getDatabaseFile, overwriteDatabaseFile } = new SQLocalKysely({
	databasePath: 'quire.sqlite3'
});

export const db = async () => {
	const thisDb = new Kysely<Database>({ dialect });
	await migrateToLatest(thisDb);
	return thisDb;
};

class getAllMigrations {
	async getMigrations() {
		return {
			Migration202502071725: { up, down }
		};
	}
}

async function migrateToLatest(db: Kysely<Database>) {
	const migrator = new Migrator({
		db,
		provider: new getAllMigrations()
	});
	const { error, results } = await migrator.migrateToLatest();
	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log('Successful migration');
		} else if (it.status === 'Error') {
			console.log('Failed migration');
		}
	});

	if (error) {
		console.error('Failed to migrate');
	}
}

export const deleteDb = deleteDatabaseFile;
export const getDb = getDatabaseFile;
export const overwriteDb = overwriteDatabaseFile;
