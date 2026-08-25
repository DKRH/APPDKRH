package migrations

import (
	"context"

	"github.com/uptrace/bun"

	password "goapi/modules/password"
)

func init() {
	Migrations.MustRegister(
		func(ctx context.Context, db *bun.DB) error {
			_, err := db.NewCreateTable().
				Model((*password.PasswordEntry)(nil)).
				IfNotExists().
				Exec(ctx)

			return err
		},

		func(ctx context.Context, db *bun.DB) error {
			_, err := db.NewDropTable().
				Model((*password.PasswordEntry)(nil)).
				IfExists().
				Exec(ctx)

			return err
		},
	)
}
