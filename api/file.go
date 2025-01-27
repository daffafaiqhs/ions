package api

import (
	"a21hc3NpZ25tZW50/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FileAPI interface {
	Upload(c *gin.Context)
}

type fileAPI struct {
	fileService service.FileService
}

func NewFileAPI(fileService service.FileService) FileAPI {
	return &fileAPI{fileService}
}

func (f *fileAPI) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	records, err := f.fileService.ReadFile(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	formattedRecords, err := f.fileService.FormatCSVContent(records)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, formattedRecords)
}
