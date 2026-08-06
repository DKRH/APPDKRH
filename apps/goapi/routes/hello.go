package routes

import "github.com/gin-gonic/gin"

func Register(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/", Hello)
		api.GET("/users", Users)
	}
}

func Hello(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello World",
	})
}

func Users(c *gin.Context) {
	c.JSON(200, gin.H{
		"users": []string{"Alice", "Bob"},
	})
}