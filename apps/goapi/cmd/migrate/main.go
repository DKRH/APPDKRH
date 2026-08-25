package main

import (
	"fmt"

	"goapi/database"
)

func main() {
	db := database.Connect()
	defer db.Close()

	fmt.Println("Running migrations...")

	database.RunMigrations(db)

	fmt.Println("Migration finished.")
}
