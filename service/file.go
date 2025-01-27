package service

import (
	"a21hc3NpZ25tZW50/model"
	repository "a21hc3NpZ25tZW50/repository"
	"encoding/csv"
	"errors"
	"mime/multipart"
	"strconv"
)

type FileService interface {
	ReadFile(file *multipart.FileHeader) ([][]string, error)
	FormatCSVContent(records [][]string) ([]model.EnergyConsumption, error)
}

type fileService struct {
	fileRepository repository.FileRepository
}

func NewFileService(fileRepository repository.FileRepository) FileService {
	return &fileService{fileRepository}
}

func (s *fileService) ReadFile(file *multipart.FileHeader) ([][]string, error) {
	// Open the uploaded file
	uploadedFile, err := file.Open()
	if err != nil {
		return [][]string{}, errors.New("failed to open file")
	}
	defer uploadedFile.Close()

	// Read the file content
	reader := csv.NewReader(uploadedFile)

	// Read all rows
	records, err := reader.ReadAll()
	if err != nil {
		return [][]string{}, errors.New("unable to parse CSV")
	}

	return records, nil
}

func (s *fileService) FormatCSVContent(records [][]string) ([]model.EnergyConsumption, error) {
	var data []model.EnergyConsumption
	for i, record := range records {
		if i == 0 {
			continue // Skip header
		}

		energy, err := strconv.ParseFloat(record[3], 64)
		if err != nil {
			return []model.EnergyConsumption{}, errors.New("invalid energy consumption value")
		}

		data = append(data, model.EnergyConsumption{
			Date:              record[0],
			Time:              record[1],
			Appliance:         record[2],
			EnergyConsumption: energy,
			Room:              record[4],
			Status:            record[5],
		})
	}
	// fmt.Println(len(data))

	return data, nil
}
