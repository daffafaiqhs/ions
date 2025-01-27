package api

import (
	"a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthAPI interface {
	Auth(c *gin.Context)
	Register(c *gin.Context)
	Login(c *gin.Context)
}

type authAPI struct {
	authService service.AuthService
}

func NewAuthAPI(authService service.AuthService) *authAPI {
	return &authAPI{authService}
}

func (a *authAPI) Auth(c *gin.Context) {
	if authenticated, _ := c.Get("authenticated"); authenticated.(string) == "true" {
		c.Status(http.StatusOK)
		return
	}

	c.Status(http.StatusUnauthorized)
}

func (a *authAPI) Login(c *gin.Context) {
	var body model.User
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := a.authService.Login(body)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie("session_token", *token, 3600, "/", "localhost", true, false)
}

func (a *authAPI) Register(c *gin.Context) {
	var body model.User
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := a.authService.Register(body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}
