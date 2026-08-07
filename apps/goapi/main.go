package main

import (
	"github.com/gin-gonic/gin"
	"github.com/DKRH/goapi/routes"
)

func main() {
	r := gin.Default()

	routes.Register(r)

	r.Run(":2602")
}