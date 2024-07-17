package main

import (
	"github.com/hbyunzai/ycloud/domain"
	_ "github.com/mattn/go-sqlite3"

	"entgo.io/ent/dialect"
)

func GetSQLite3() (*domain.Client, error) {
	client, err := domain.Open(dialect.SQLite, "file:ent.db?cache=shared&_fk=1&mode=rwc&journal_mode=wal&synchronous=normal")
	return client, err
}
