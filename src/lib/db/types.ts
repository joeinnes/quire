// src/types.ts

import type { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface UsersTable {
	id: Generated<string>;
	username: string | null;
	name: string | null;
	email: string | null;
	created_at: ColumnType<string, string, never>;
	updated_at: ColumnType<string, string, never>;
}

export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export interface UserPreferencesTable {
	user_id: string;
	preferences: string | null;
}

export type UserPreferences = Selectable<UserPreferencesTable>;
export type NewUserPreferences = Insertable<UserPreferencesTable>;
export type UserPreferencesUpdate = Updateable<UserPreferencesTable>;

export interface BooksTable {
	id: Generated<string>;
	external_api_id: string;
	title: string;
	authors: string | null;
	description: string | null;
	image_url: string | null;
	created_at: ColumnType<string, string, never>;
	updated_at: ColumnType<string, string, never>;
}

export type Book = Selectable<BooksTable>;
export type NewBook = Insertable<BooksTable>;
export type BookUpdate = Updateable<BooksTable>;

export interface ShelvesTable {
	id: Generated<string>;
	user_id: string;
	name: string;
	is_default: number;
	created_at: ColumnType<string, string, never>;
	updated_at: ColumnType<string, string, never>;
}

export type Shelf = Selectable<ShelvesTable>;
export type NewShelf = Insertable<ShelvesTable>;
export type ShelfUpdate = Updateable<ShelvesTable>;

export interface ShelfBooksTable {
	shelf_id: string;
	book_id: string;
	added_at: ColumnType<string, string, never>;
}

export type ShelfBook = Selectable<ShelfBooksTable>;
export type NewShelfBook = Insertable<ShelfBooksTable>;
export type ShelfBookUpdate = Updateable<ShelfBooksTable>;

export interface ReadingSessionsTable {
	id: Generated<string>;
	user_id: string;
	book_id: string;
	started_at: string | null;
	finished_at: string | null;
	rating: number | null;
	notes: string | null;
	created_at: ColumnType<string, string, never>;
	updated_at: ColumnType<string, string, never>;
}

export type ReadingSession = Selectable<ReadingSessionsTable>;
export type NewReadingSession = Insertable<ReadingSessionsTable>;
export type ReadingSessionUpdate = Updateable<ReadingSessionsTable>;

export interface Database {
	users: UsersTable;
	user_preferences: UserPreferencesTable;
	books: BooksTable;
	shelves: ShelvesTable;
	shelf_books: ShelfBooksTable;
	reading_sessions: ReadingSessionsTable;
}
