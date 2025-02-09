import { Kysely, sql } from 'kysely';
import type { Database } from '../types';

export async function up(db: Kysely<Database>): Promise<void> {
	// Create users table
	await db.schema
		.createTable('users')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('username', 'text')
		.addColumn('name', 'text')
		.addColumn('email', 'text')
		.addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute();

	// Create user_preferences table
	await db.schema
		.createTable('user_preferences')
		.addColumn('user_id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('preferences', 'text')
		.addForeignKeyConstraint('fk_user_preferences_user', ['user_id'], 'users', ['id'])
		.execute();

	// Create books table
	await db.schema
		.createTable('books')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('external_api_id', 'text', (col) => col.notNull())
		.addColumn('title', 'text', (col) => col.notNull())
		.addColumn('authors', 'text')
		.addColumn('description', 'text')
		.addColumn('image_url', 'text')
		.addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.execute();

	// Create shelves table
	await db.schema
		.createTable('shelves')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('user_id', 'text', (col) => col.notNull())
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('is_default', 'integer', (col) => col.defaultTo(0).notNull())
		.addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addForeignKeyConstraint('fk_shelves_user', ['user_id'], 'users', ['id'])
		.execute();

	// Create shelf_books join table
	await db.schema
		.createTable('shelf_books')
		.addColumn('shelf_id', 'text', (col) => col.notNull())
		.addColumn('book_id', 'text', (col) => col.notNull())
		.addColumn('added_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addPrimaryKeyConstraint('pk_shelf_books', ['shelf_id', 'book_id'])
		.addForeignKeyConstraint('fk_shelf_books_shelf', ['shelf_id'], 'shelves', ['id'])
		.addForeignKeyConstraint('fk_shelf_books_book', ['book_id'], 'books', ['id'])
		.execute();

	// Create reading_sessions table
	await db.schema
		.createTable('reading_sessions')
		.addColumn('id', 'text', (col) => col.primaryKey().notNull())
		.addColumn('user_id', 'text', (col) => col.notNull())
		.addColumn('book_id', 'text', (col) => col.notNull())
		.addColumn('started_at', 'text')
		.addColumn('finished_at', 'text')
		.addColumn('rating', 'real')
		.addColumn('notes', 'text')
		.addColumn('created_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addColumn('updated_at', 'text', (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
		.addForeignKeyConstraint('fk_reading_sessions_user', ['user_id'], 'users', ['id'])
		.addForeignKeyConstraint('fk_reading_sessions_book', ['book_id'], 'books', ['id'])
		.execute();

	await db
		.selectFrom('users')
		.selectAll()
		.executeTakeFirst()
		.then(async (res) => {
			if (!res) {
				return db
					.insertInto('users')
					.values({
						id: crypto.randomUUID(),
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					})
					.returningAll()
					.executeTakeFirst();
			}
			return res;
		});
}

export async function down(db: Kysely<Database>): Promise<void> {
	// Drop tables in reverse order to handle dependencies
	await db.schema.dropTable('reading_sessions').execute();
	await db.schema.dropTable('shelf_books').execute();
	await db.schema.dropTable('shelves').execute();
	await db.schema.dropTable('books').execute();
	await db.schema.dropTable('user_preferences').execute();
	await db.schema.dropTable('users').execute();
}
