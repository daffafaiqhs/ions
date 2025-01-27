package model

import "gorm.io/gorm"

type TapasInput struct {
	Table map[string][]string `json:"table"`
	Query string              `json:"query"`
}

type PhiInput struct {
	Model     string       `json:"model"`
	Messages  []PhiMessage `json:"messages"`
	MaxTokens int          `json:"max_tokens"`
	Stream    bool         `json:"stream"`
}
type PhiMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type TapasResponse struct {
	Answer      string   `json:"answer"`
	Coordinates [][]int  `json:"coordinates"`
	Cells       []string `json:"cells"`
	Aggregator  string   `json:"aggregator"`
	Error       string   `json:"error"`
}

type PhiResponse struct {
	Choices []struct {
		Message PhiMessage `json:"message"`
	} `json:"choices"`
}

type EnergyConsumption struct {
	Date              string  `json:"date"`
	Time              string  `json:"time"`
	Appliance         string  `json:"appliance"`
	EnergyConsumption float64 `json:"energy_consumption"`
	Room              string  `json:"room"`
	Status            string  `json:"status"`
}

type AIRequestPayload struct {
	Query   string              `json:"query"`
	Context string              `json:"context"`
	Data    []EnergyConsumption `json:"data"`
	Header  []string            `json:"header"`
}

type Credential struct {
	Host         string
	Username     string
	Password     string
	DatabaseName string
	Port         int
	Schema       string
}

type User struct {
	gorm.Model
	Fullname string `json:"fullname"`
	Email    string `json:"email" gorm:"type:varchar(100);unique"`
	Password string `json:"password"`
}
