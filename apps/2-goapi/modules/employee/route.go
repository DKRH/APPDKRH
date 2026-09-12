package employee

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

	employees := router.Group("/employees")
	{
		employees.POST("", handler.Create)
		employees.GET("", handler.GetAll)
		employees.GET("/:id", handler.GetByID)
		employees.PUT("/:id", handler.Update)
		employees.PATCH("/:id/status", handler.UpdateStatus)
		employees.DELETE("/:id", handler.Delete)
	}
}
