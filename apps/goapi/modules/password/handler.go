package password

import (
	"github.com/gin-gonic/gin"
)

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{
		repo: repo,
	}
}

// Password methods
func (h *Handler) Create(c *gin.Context)  {}
func (h *Handler) GetAll(c *gin.Context)  {}
func (h *Handler) GetByID(c *gin.Context) {}
func (h *Handler) Update(c *gin.Context)  {}
func (h *Handler) Delete(c *gin.Context)  {}

// Password group methods
func (h *Handler) CreateGroup(c *gin.Context)  {}
func (h *Handler) GetAllGroups(c *gin.Context) {}
func (h *Handler) GetGroupByID(c *gin.Context) {}
func (h *Handler) UpdateGroup(c *gin.Context)  {}
func (h *Handler) DeleteGroup(c *gin.Context)  {}
