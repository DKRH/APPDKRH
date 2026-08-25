package main

import (
	"os"

	"github.com/gin-gonic/gin"
	//"github.com/DKRH/goapi/routes"
	"goapi/database"
	passwordModule "goapi/modules/password"
)

func main() {
	db := database.Connect()
	defer db.Close()

	r := gin.Default()

	//routes.Register(r)
	api := r.Group("/api")
	{
		passwordModule.RegisterRoutes(api, db)
	}

	port := os.Getenv("GOAPI_PORT")

	if port == "" {
		port = "2602"
	}

	if err := r.Run(":" + port); err != nil {
		panic(err)
	}
}
