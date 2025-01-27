package service

import (
	"a21hc3NpZ25tZW50/model"
	"errors"
	"fmt"

	"github.com/go-resty/resty/v2"
)

type AIService interface {
	GoogleTapas(rawEnergyConsumption []model.EnergyConsumption, query, token string) (string, error)
	MicrosoftPhi(context, query, token string) (model.PhiResponse, error)
}

type aIService struct {
	client *resty.Client
}

func NewAIService(client *resty.Client) AIService {
	return &aIService{client}
}

func (s *aIService) GoogleTapas(rawEnergyConsumption []model.EnergyConsumption, query, token string) (string, error) {
	if len(rawEnergyConsumption) == 0 {
		return "", errors.New("analyze data: data is empty")
	}

	energyConsumption := make(map[string][]string)
	for _, entry := range rawEnergyConsumption {
		energyConsumption["Date"] = append(energyConsumption["Date"], entry.Date)
		energyConsumption["Time"] = append(energyConsumption["Time"], entry.Time)
		energyConsumption["Appliance"] = append(energyConsumption["Appliance"], entry.Appliance)
		energyConsumption["EnergyConsumption"] = append(energyConsumption["EnergyConsumption"], fmt.Sprintf("%f", entry.EnergyConsumption))
		energyConsumption["Room"] = append(energyConsumption["Room"], entry.Room)
		energyConsumption["Status"] = append(energyConsumption["Status"], entry.Status)
	}

	url := "https://api-inference.huggingface.co/models/google/tapas-base-finetuned-wtq"
	input := model.TapasInput{Table: energyConsumption, Query: query}

	var tapasResponse model.TapasResponse

	resp, err := s.client.R().
		SetHeader("Content-Type", "application/json").
		SetAuthToken(token).
		SetBody(input).
		SetResult(&tapasResponse).
		Post(url)

	if err != nil {
		return "", err
	}

	if resp.IsError() {
		return "", fmt.Errorf("google/Tapas: %s", string(resp.Body()))
	}

	if tapasResponse.Error != "" {
		return "", errors.New(tapasResponse.Error)
	}

	return tapasResponse.Answer, nil
}

func (s *aIService) MicrosoftPhi(context, query, token string) (model.PhiResponse, error) {
	if query == "" {
		return model.PhiResponse{}, errors.New("chat with ai: query is empty")
	}

	aiModel := "microsoft/Phi-3.5-mini-instruct"
	url := fmt.Sprintf("https://api-inference.huggingface.co/models/%s/v1/chat/completions", aiModel)

	input := model.PhiInput{
		Model: aiModel,
		Messages: []model.PhiMessage{
			{
				Role:    "user",
				Content: fmt.Sprintf("Context:%s. %s", context, query),
			},
		},
		MaxTokens: 500,
		Stream:    false,
	}

	var phiResponse model.PhiResponse

	resp, err := s.client.R().
		SetHeader("Content-Type", "application/json").
		SetAuthToken(token).
		SetBody(input).
		SetResult(&phiResponse).
		Post(url)

	if err != nil {
		return model.PhiResponse{}, err
	}

	if resp.IsError() {
		return model.PhiResponse{}, fmt.Errorf("microsoft/Phi: received error response: %s", string(resp.Body()))
	}

	return phiResponse, nil
}
