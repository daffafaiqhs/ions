package model

import (
	"log"
	"os"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

// Get the JWT key from the environment variable
var JwtKey = []byte(os.Getenv("JWT_SECRET_KEY"))

type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
