package employee

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
)

type Service interface {
	Create(
		ctx context.Context,
		req CreateEmployeeRequest,
	) (*Employee, error)

	GetByID(
		ctx context.Context,
		id uuid.UUID,
	) (*Employee, error)

	List(
		ctx context.Context,
		filter ListFilter,
	) ([]Employee, int, error)

	Update(
		ctx context.Context,
		id uuid.UUID,
		req UpdateEmployeeRequest,
	) (*Employee, error)

	UpdateStatus(
		ctx context.Context,
		id uuid.UUID,
		status EmployeeStatus,
	) error

	Delete(
		ctx context.Context,
		id uuid.UUID,
	) error
}

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{
		repository: repository,
	}
}

func (s *service) Create(
	ctx context.Context,
	req CreateEmployeeRequest,
) (*Employee, error) {
	if err := validateCreateRequest(req); err != nil {
		return nil, err
	}

	existing, err := s.repository.FindByEmployeeNo(
		ctx,
		req.EmployeeNo,
	)

	if err != nil && !errors.Is(err, ErrNotFound) {
		return nil, err
	}

	if existing != nil {
		return nil, ErrConflict
	}

	employee := &Employee{
		ID:         uuid.New(),
		EmployeeNo: strings.TrimSpace(req.EmployeeNo),

		FirstName:     strings.TrimSpace(req.FirstName),
		MiddleName:    req.MiddleName,
		LastName:      req.LastName,
		PreferredName: req.PreferredName,

		BirthDate:   req.BirthDate,
		Gender:      req.Gender,
		Nationality: req.Nationality,

		Email: req.Email,
		Phone: req.Phone,

		Address:    req.Address,
		City:       req.City,
		Province:   req.Province,
		PostalCode: req.PostalCode,
		Country:    req.Country,

		EmergencyContactName:  req.EmergencyContactName,
		EmergencyContactPhone: req.EmergencyContactPhone,

		HireDate: req.HireDate,

		Status: EmployeeStatusActive,
	}

	if err := s.repository.Create(
		ctx,
		employee,
	); err != nil {
		return nil, err
	}

	return employee, nil
}

func validateCreateRequest(
	req CreateEmployeeRequest,
) error {
	if strings.TrimSpace(req.EmployeeNo) == "" {
		return fmt.Errorf(
			"employeeNo is required",
		)
	}

	if strings.TrimSpace(req.FirstName) == "" {
		return fmt.Errorf(
			"firstName is required",
		)
	}

	if req.HireDate.IsZero() {
		return fmt.Errorf(
			"hireDate is required",
		)
	}

	return nil
}

func (s *service) GetByID(
	ctx context.Context,
	id uuid.UUID,
) (*Employee, error) {
	if id == uuid.Nil {
		return nil, fmt.Errorf(
			"invalid employee id",
		)
	}

	return s.repository.FindByID(ctx, id)
}

func (s *service) List(
	ctx context.Context,
	filter ListFilter,
) ([]Employee, int, error) {
	if filter.Limit <= 0 {
		filter.Limit = 20
	}

	if filter.Limit > 100 {
		filter.Limit = 100
	}

	if filter.Offset < 0 {
		filter.Offset = 0
	}

	filter.Search = strings.TrimSpace(
		filter.Search,
	)

	return s.repository.List(
		ctx,
		filter,
	)
}

func (s *service) Update(
	ctx context.Context,
	id uuid.UUID,
	req UpdateEmployeeRequest,
) (*Employee, error) {
	if id == uuid.Nil {
		return nil, fmt.Errorf(
			"invalid employee id",
		)
	}

	if strings.TrimSpace(req.FirstName) == "" {
		return nil, fmt.Errorf(
			"firstName is required",
		)
	}

	employee, err := s.repository.FindByID(
		ctx,
		id,
	)
	if err != nil {
		return nil, err
	}

	employee.FirstName = strings.TrimSpace(
		req.FirstName,
	)

	employee.MiddleName = req.MiddleName
	employee.LastName = req.LastName
	employee.PreferredName = req.PreferredName

	employee.BirthDate = req.BirthDate
	employee.Gender = req.Gender
	employee.Nationality = req.Nationality

	employee.Email = req.Email
	employee.Phone = req.Phone

	employee.Address = req.Address
	employee.City = req.City
	employee.Province = req.Province
	employee.PostalCode = req.PostalCode
	employee.Country = req.Country

	employee.EmergencyContactName =
		req.EmergencyContactName

	employee.EmergencyContactPhone =
		req.EmergencyContactPhone

	employee.HireDate = req.HireDate

	if err := s.repository.Update(
		ctx,
		employee,
	); err != nil {
		return nil, err
	}

	return employee, nil
}

func (s *service) UpdateStatus(
	ctx context.Context,
	id uuid.UUID,
	status EmployeeStatus,
) error {
	switch status {
	case EmployeeStatusActive,
		EmployeeStatusInactive,
		EmployeeStatusTerminated:

	default:
		return fmt.Errorf(
			"invalid employee status",
		)
	}

	return s.repository.UpdateStatus(
		ctx,
		id,
		status,
	)
}

func (s *service) Delete(
	ctx context.Context,
	id uuid.UUID,
) error {
	if id == uuid.Nil {
		return errors.New(
			"invalid employee id",
		)
	}

	return s.repository.Delete(
		ctx,
		id,
	)
}
