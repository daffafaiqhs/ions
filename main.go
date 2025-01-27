package main

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"a21hc3NpZ25tZW50/api"
	"a21hc3NpZ25tZW50/middleware"
	"a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/repository"
	"a21hc3NpZ25tZW50/service"
)

type APIHandler struct {
	AuthAPIHandler api.AuthAPI
	FileAPIHandler api.FileAPI
	AIAPIHandler   api.AIAPI
}

func Connect(creds *model.Credential) (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=disable TimeZone=Asia/Jakarta",
		creds.Host, creds.Username, creds.Password, creds.DatabaseName, creds.Port,
	)
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	token := os.Getenv("HUGGINGFACE_TOKEN")
	if token == "" {
		log.Fatal("HUGGINGFACE_TOKEN is not set in the .env file")
	}

	// Database connection
	dbHost := os.Getenv("HOST")
	dbName := os.Getenv("DB_NAME")
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbPortStr := os.Getenv("DB_PORT")
	if dbHost == "" || dbName == "" || dbUsername == "" || dbPassword == "" || dbPortStr == "" {
		log.Fatal("Database credentials are missing in the .env file")
	}

	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		log.Fatal("DB_PORT must be a number")
	}

	dbConn, err := Connect(&model.Credential{
		Host:         dbHost,
		Username:     dbUsername,
		Password:     dbPassword,
		DatabaseName: dbName,
		Port:         dbPort,
	})
	if err != nil {
		log.Fatal(err)
	}

	dbConn.AutoMigrate(&model.User{})

	authRepository := repository.NewAuthRepository(dbConn)
	fileRepository := repository.NewFileRepository()

	authService := service.NewAuthService(authRepository)
	fileService := service.NewFileService(fileRepository)
	aiService := service.NewAIService(resty.New())

	authAPIHandler := api.NewAuthAPI(authService)
	fileAPIHandler := api.NewFileAPI(fileService)
	aiAPIHandler := api.NewAIAPI(aiService, token)

	apiHandler := APIHandler{
		AuthAPIHandler: authAPIHandler,
		FileAPIHandler: fileAPIHandler,
		AIAPIHandler:   aiAPIHandler,
	}

	r := gin.Default()
	r.Use(middleware.Cors())

	api := r.Group("/api/v1")
	{
		api.POST("/login", apiHandler.AuthAPIHandler.Login)
		api.POST("/register", apiHandler.AuthAPIHandler.Register)
		api.Use(middleware.Auth())
		api.POST("/auth", apiHandler.AuthAPIHandler.Auth)
		api.POST("/upload", apiHandler.FileAPIHandler.Upload)
		api.POST("/chat", apiHandler.AIAPIHandler.Chat)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)
	r.Run(":" + port)
}
