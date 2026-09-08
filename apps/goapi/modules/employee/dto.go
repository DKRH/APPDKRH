package employee

import "time"

type CreateEmployeeRequest struct {
	EmployeeNo string `json:"employeeNo"`

	FirstName     string  `json:"firstName"`
	MiddleName    *string `json:"middleName"`
	LastName      *string `json:"lastName"`
	PreferredName *string `json:"preferredName"`

	BirthDate   *time.Time `json:"birthDate"`
	Gender      *string    `json:"gender"`
	Nationality *string    `json:"nationality"`

	Email *string `json:"email"`
	Phone *string `json:"phone"`

	Address    *string `json:"address"`
	City       *string `json:"city"`
	Province   *string `json:"province"`
	PostalCode *string `json:"postalCode"`
	Country    *string `json:"country"`

	EmergencyContactName  *string `json:"emergencyContactName"`
	EmergencyContactPhone *string `json:"emergencyContactPhone"`

	HireDate time.Time `json:"hireDate"`
}

type UpdateEmployeeRequest struct {
	FirstName     string  `json:"firstName"`
	MiddleName    *string `json:"middleName"`
	LastName      *string `json:"lastName"`
	PreferredName *string `json:"preferredName"`

	BirthDate   *time.Time `json:"birthDate"`
	Gender      *string    `json:"gender"`
	Nationality *string    `json:"nationality"`

	Email *string `json:"email"`
	Phone *string `json:"phone"`

	Address    *string `json:"address"`
	City       *string `json:"city"`
	Province   *string `json:"province"`
	PostalCode *string `json:"postalCode"`
	Country    *string `json:"country"`

	EmergencyContactName  *string `json:"emergencyContactName"`
	EmergencyContactPhone *string `json:"emergencyContactPhone"`

	HireDate time.Time `json:"hireDate"`
}

type UpdateEmployeeStatusRequest struct {
	Status EmployeeStatus `json:"status"`
}
