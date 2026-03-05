import os
from contextlib import asynccontextmanager
from sqlite3 import Connection

import aiosqlite

DEFAULT_DB_PATH = "./db/ivy.db"

class DatabaseManager:
    """
    Manages the SQLite database connection and provides methods for executing queries and transactions.
    """

    def __init__(self):
        self.db_path = os.getenv("DB_PATH", DEFAULT_DB_PATH)
        self._db = None

    async def check_for_db(self):
        """
        Checks if the database file exists at the specified path. If it does not exist, it creates the necessary directories and initializes the database schema.
        """
        does_db_exist = os.path.exists(self.db_path)
        if does_db_exist:
            print("Database found, skipping initialization.")
            return
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        async with aiosqlite.connect(self.db_path) as db:
            await self.initialize_db_state(db)
            await db.commit()

    @staticmethod
    async def initialize_db_state(db: aiosqlite.Connection):
        """
        Initializes the database schema by creating the necessary tables for locations, items, tags, and their relationships.
        This should probably be moved to a seed script or real migrations system (alembic?)=
        :param db: The database connection to use for executing the schema initialization commands.
        """
        # TODO: I probably should move this to an external seed script of some kind
        await db.execute("CREATE TABLE locations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER DEFAULT 0, parent_location_id INTEGER, FOREIGN KEY (parent_location_id) REFERENCES locations(id) ON DELETE SET NULL)")
        await db.execute("CREATE TABLE items (id INTEGER PRIMARY KEY, name TEXT NOT NULL, description TEXT, image TEXT, location_id INTEGER, quantity INTEGER, date_of_purchase TEXT, buy_price REAL, bought_from TEXT, serial_number TEXT, model_number TEXT, isbn TEXT, notes TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER DEFAULT 0, FOREIGN KEY(location_id) REFERENCES locations(id))")
        await db.execute("CREATE TABLE tags (id INTEGER PRIMARY KEY, name TEXT NOT NULL, COLOR TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INTEGER DEFAULT 0)")
        await db.execute("CREATE TABLE item_tag_mappings (item_id INTEGER, tag_id INTEGER, FOREIGN KEY(item_id) REFERENCES items(id), FOREIGN KEY(tag_id) REFERENCES tags(id), PRIMARY KEY(item_id, tag_id))")
        await db.execute("CREATE TABLE item_attachment_mappings (id INTEGER PRIMARY KEY, item_id INTEGER, attachment_path TEXT, FOREIGN KEY(item_id) REFERENCES items(id))")
        await db.commit()

    async def execute(self, sql: str, params: tuple = ()) -> aiosqlite.Cursor:
        """
        Executes a single SQL command with the provided parameters.
        :param sql: The SQL command to execute.
        :param params: A tuple of parameters to be used in the SQL command.
        :return: The cursor resulting from the execution of the SQL command.
        """
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(sql, params)
            await db.commit()
            return cursor

    async def execute_transaction(self, sql_commands: list[tuple[str, tuple]]):
        """
        Executes a list of SQL commands as a single transaction. If any command fails, the entire transaction is rolled back.
        This is mainly used for executing commands that are related like item + tag + attachment linking.
        :param sql_commands: A list of tuples, where each tuple contains an SQL command and its corresponding parameters.
        """
        async with aiosqlite.connect(self.db_path) as db:
            async with db.execute("BEGIN"):
                for sql, params in sql_commands:
                    await db.execute(sql, params)
            await db.commit()

    async def fetch_all(self, sql: str, params: tuple = ()) -> list[tuple]:
        """
        Executes a SQL query and fetches all results.
        :param sql: The SQL query to execute.
        :param params: A tuple of parameters to be used in the SQL query.
        :return: A list of tuples representing the rows returned by the query.
        """
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(sql, params)
            rows = await cursor.fetchall()
            return rows

    async def fetch_one(self, sql: str, params: tuple = ()):
        """
        Executes a SQL query and fetches a single result. Note that the whole query will still be executed even if
        only one result is returned. So this should only be used if you could add a LIMIT 1 which you should probably
        do for performance reasons then. Might add an automatic LIMIT later on.
        """
        # TODO: check if I cann add an automatic LIMIT 1 append to the query.
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.execute(sql, params)
            rows = await cursor.fetchone()
            return rows

    async def connect(self):
        """
        Establishes a persistent connection to the database.
        """
        self._db = await aiosqlite.connect(self.db_path)

    @asynccontextmanager
    async def transaction(self):
        """
        Context manager for executing within a transaction.
        """
        await self._db.execute("BEGIN")
        try:
            yield self._db
            await self._db.commit()
        except:
            await self._db.rollback()
            raise
