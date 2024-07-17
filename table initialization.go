package main

import (
	"context"
	"github.com/hbyunzai/ycloud/domain/migrate"
)

func TableInitialization() error {
	sqlite3, err := GetSQLite3()
	if err != nil {
		return err
	}
	ctx := context.Background()
	if err := sqlite3.Debug().Schema.Create(ctx, migrate.WithDropIndex(true), migrate.WithDropColumn(true)); err != nil {
		return err
	}
	return sqlite3.Close()
}
