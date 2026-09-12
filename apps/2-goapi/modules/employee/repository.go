package employee

import (
	"context"
	"errors"
	"strings"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(
	ctx context.Context,
	employee *Employee,
) error {
	_, err := r.db.NewInsert().
		Model(employee).
		Exec(ctx)

	return err
}

func (r *Repository) GetAll(
	ctx context.Context,
	search string,
	status EmployeeStatus,
	limit int,
	offset int,
) ([]Employee, int, error) {
	var employees []Employee

	query := r.db.NewSelect().
		Model(&employees).
		OrderExpr("employee_no ASC")

	if search != "" {
		search = "%" + strings.TrimSpace(search) + "%"

		query = query.Where(
			"(employee_no ILIKE ? OR first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?)",
			search, search, search, search,
		)
	}

	if status != "" {
		query = query.Where("status = ?", status)
	}

	total, err := query.Clone().Count(ctx)
	if err != nil {
		return nil, 0, err
	}

	if limit <= 0 {
		limit = 20
	}

	if offset < 0 {
		offset = 0
	}

	err = query.
		Limit(limit).
		Offset(offset).
		Scan(ctx)

	return employees, total, err
}

func (r *Repository) GetByID(
	ctx context.Context,
	id uuid.UUID,
) (*Employee, error) {
	employee := new(Employee)

	err := r.db.NewSelect().
		Model(employee).
		Where("id = ?", id).
		Scan(ctx)

	return employee, err
}

func (r *Repository) Update(
	ctx context.Context,
	employee *Employee,
) error {
	_, err := r.db.NewUpdate().
		Model(employee).
		WherePK().
		Column(
			"first_name",
			"middle_name",
			"last_name",
			"preferred_name",
			"birth_date",
			"gender",
			"nationality",
			"email",
			"phone",
			"address",
			"city",
			"province",
			"postal_code",
			"country",
			"emergency_contact_name",
			"emergency_contact_phone",
			"hire_date",
		).
		Set("updated_at = NOW()").
		Exec(ctx)

	return err
}

func (r *Repository) UpdateStatus(
	ctx context.Context,
	id uuid.UUID,
	status EmployeeStatus,
) error {
	result, err := r.db.NewUpdate().
		Model((*Employee)(nil)).
		Set("status = ?", status).
		Set("updated_at = NOW()").
		Where("id = ?", id).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("employee not found")
	}

	return nil
}

func (r *Repository) Delete(
	ctx context.Context,
	id uuid.UUID,
) error {
	result, err := r.db.NewUpdate().
		Model((*Employee)(nil)).
		Set("deleted_at = NOW()").
		Set("status = ?", EmployeeStatusInactive).
		Set("updated_at = NOW()").
		Where("id = ?", id).
		Exec(ctx)

	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("employee not found")
	}

	return nil
}
