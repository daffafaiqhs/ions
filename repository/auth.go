package repository

import (
	"a21hc3NpZ25tZW50/model"

	"gorm.io/gorm"
)

type AuthRepository interface {
	FindUser(user model.User) error
	CreateUser(user model.User) error
}

type authRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) AuthRepository {
	return &authRepository{db}
}

func (r *authRepository) FindUser(user model.User) error {
	return r.db.First(&user, "email = ? AND password = ?", user.Email, user.Password).Error
}

func (r *authRepository) CreateUser(user model.User) error {
	return r.db.Create(&user).Error
}
