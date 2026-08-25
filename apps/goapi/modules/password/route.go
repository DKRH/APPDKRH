package password

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func RegisterRoutes(
	router *gin.RouterGroup,
	db *bun.DB,
) {
	repo := NewRepository(db)
	handler := NewHandler(repo)

	// Password routes
	passwords := router.Group("/passwords")
	{
		passwords.POST("", handler.Create)
		passwords.GET("", handler.GetAll)
		passwords.GET("/:id", handler.GetByID)
		passwords.DELETE("/:id", handler.Delete)
	}

	// Password group routes
	groups := router.Group("/password-groups")
	{
		groups.POST("", handler.CreateGroup)
		groups.GET("", handler.GetAllGroups)
		groups.GET("/:id", handler.GetGroupByID)
		groups.PUT("/:id", handler.UpdateGroup)
		groups.DELETE("/:id", handler.DeleteGroup)
	}
}
