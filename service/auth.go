package service

import (
	"a21hc3NpZ25tZW50/model"
	"a21hc3NpZ25tZW50/repository"
	"errors"
	"time"

	"github.com/golang-jwt/jwt"
	"gorm.io/gorm"
)

type AuthService interface {
	Register(user model.User) error
	Login(user model.User) (token *string, err error)
}

type authService struct {
	authRepository repository.AuthRepository
}

func NewAuthService(authRepository repository.AuthRepository) AuthService {
	return &authService{authRepository}
}

func (s *authService) Login(user model.User) (token *string, err error) {
	if err := s.authRepository.FindUser(user); err != nil {
		return nil, err
	}

	expirationTime := time.Now().Add(20 * time.Minute)
	claims := &model.Claims{
		Email: user.Email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := t.SignedString(model.JwtKey)
	if err != nil {
		return nil, err
	}

	return &tokenString, nil
}

func (s *authService) Register(user model.User) error {
	isRegistered := true
	if err := s.authRepository.FindUser(user); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			isRegistered = false
		} else {
			return err
		}
	}

	if isRegistered {
		return errors.New("email already exists")
	}

	if err := s.authRepository.CreateUser(user); err != nil {
		return err
	}

	return nil
}
