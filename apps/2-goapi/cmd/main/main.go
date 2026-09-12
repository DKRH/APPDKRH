package main

import (
	"os"

	"github.com/gin-gonic/gin"
	//"github.com/DKRH/goapi/routes"
	"goapi/database"

	employeeModule "goapi/modules/employee"
)

func main() {
	db := database.Connect()
	defer db.Close()

	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.String(200, "DKRH API Golang")
	})

	//routes.Register(r)
	api := r.Group("/api")
	{
		employeeModule.RegisterRoutes(api, db)
	}

	port := os.Getenv("GO_API_PORT")

	if port == "" {
		port = "2602"
	}

	if err := r.Run(":" + port); err != nil {
		panic(err)
	}
}
