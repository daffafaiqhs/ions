package api

import (
	"a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/service"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type AIAPI interface {
	Chat(c *gin.Context)
}

type aiAPI struct {
	aiService service.AIService
	hfToken   string
}

func NewAIAPI(aIService service.AIService, hfToken string) AIAPI {
	return &aiAPI{aIService, hfToken}
}

func (a *aiAPI) Chat(c *gin.Context) {
	var payload model.AIRequestPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	id, err := strconv.Atoi(c.Query("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var response map[string]string
	if id == 0 {
		apiResp, err := a.aiService.MicrosoftPhi("", payload.Query, a.hfToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		response = map[string]string{"content": apiResp.Choices[0].Message.Content}
	} else {
		apiResp, err := a.aiService.GoogleTapas(payload.Data, payload.Query, a.hfToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		response = map[string]string{"content": apiResp}
	}

	c.JSON(http.StatusOK, response)
}
