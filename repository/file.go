package repository

import (
	"os"
)

type FileRepository interface {
	SaveFile(filename string, content []byte) error
	ReadFile(filename string) ([]byte, error)
	FileExists(filename string) bool
}

type fileRepository struct{}

func NewFileRepository() FileRepository {
	return &fileRepository{}
}

// SaveFile saves the uploaded file content to the server's file system
func (r *fileRepository) SaveFile(filename string, content []byte) error {
	return os.WriteFile(filename, content, 0644)
}

// ReadFile reads the content of a file from the server's file system
func (r *fileRepository) ReadFile(filename string) ([]byte, error) {
	return os.ReadFile(filename)
}

// FileExists checks if a file already exists
func (r *fileRepository) FileExists(filename string) bool {
	_, err := os.Stat(filename)
	return !os.IsNotExist(err)
}
