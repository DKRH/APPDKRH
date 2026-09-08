package employee

import (
	"time"

	"github.com/google/uuid"
)

type EmployeeStatus string

const (
	EmployeeStatusActive     EmployeeStatus = "ACTIVE"
	EmployeeStatusInactive   EmployeeStatus = "INACTIVE"
	EmployeeStatusTerminated EmployeeStatus = "TERMINATED"
)

type Employee struct {
	ID uuid.UUID `json:"id"`

	EmployeeNo string `json:"employeeNo"`

	FirstName     string  `json:"firstName"`
	MiddleName    *string `json:"middleName,omitempty"`
	LastName      *string `json:"lastName,omitempty"`
	PreferredName *string `json:"preferredName,omitempty"`

	BirthDate   *time.Time `json:"birthDate,omitempty"`
	Gender      *string    `json:"gender,omitempty"`
	Nationality *string    `json:"nationality,omitempty"`

	Email *string `json:"email,omitempty"`
	Phone *string `json:"phone,omitempty"`

	Address    *string `json:"address,omitempty"`
	City       *string `json:"city,omitempty"`
	Province   *string `json:"province,omitempty"`
	PostalCode *string `json:"postalCode,omitempty"`
	Country    *string `json:"country,omitempty"`

	EmergencyContactName  *string `json:"emergencyContactName,omitempty"`
	EmergencyContactPhone *string `json:"emergencyContactPhone,omitempty"`

	HireDate time.Time `json:"hireDate"`

	Status EmployeeStatus `json:"status"`

	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}
