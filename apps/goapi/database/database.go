package database

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
)

var DB *bun.DB

func Connect() *bun.DB {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic("Error loading .env")
	}

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("GOAPI_DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)

	sqldb := sql.OpenDB(
		pgdriver.NewConnector(
			pgdriver.WithDSN(dsn),
		),
	)

	db := bun.NewDB(
		sqldb,
		pgdialect.New(),
	)

	if err := db.Ping(); err != nil {
		panic(fmt.Sprintf(
			"Database connection failed: %v",
			err,
		))
	}

	DB = db

	return db
}
