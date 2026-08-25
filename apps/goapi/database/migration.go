package database

import (
	"context"
	"fmt"

	"github.com/uptrace/bun"
	"github.com/uptrace/bun/migrate"

	"goapi/migrations"
)

func RunMigrations(db *bun.DB) {
	ctx := context.Background()

	migrator := migrate.NewMigrator(
		db,
		migrations.Migrations,
	)

	if err := migrator.Init(ctx); err != nil {
		panic(err)
	}

	group, err := migrator.Migrate(ctx)
	if err != nil {
		panic(err)
	}

	if group.IsZero() {
		fmt.Println("No new migrations")
		return
	}

	fmt.Printf(
		"Migrated group %s\n",
		group,
	)
}
