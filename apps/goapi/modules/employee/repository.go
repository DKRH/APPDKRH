package employee

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

func isUniqueViolation(err error) bool {
	var pgErr *pgx.PgError

	return errors.As(err, &pgErr) &&
		pgErr.Code == "23505"
}

var (
	ErrNotFound = errors.New("employee not found")
	ErrConflict = errors.New("employee already exists")
)

type Repository interface {
	Create(ctx context.Context, employee *Employee) error
	FindByID(ctx context.Context, id uuid.UUID) (*Employee, error)
	FindByEmployeeNo(ctx context.Context, employeeNo string) (*Employee, error)
	List(ctx context.Context, filter ListFilter) ([]Employee, int, error)
	Update(ctx context.Context, employee *Employee) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status EmployeeStatus) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type ListFilter struct {
	Search string

	Status *EmployeeStatus

	Limit  int
	Offset int
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) Create(
	ctx context.Context,
	employee *Employee,
) error {
	const query = `
		INSERT INTO hr_employee (
			id,
			employee_no,
			first_name,
			middle_name,
			last_name,
			preferred_name,
			birth_date,
			gender,
			nationality,
			email,
			phone,
			address,
			city,
			province,
			postal_code,
			country,
			emergency_contact_name,
			emergency_contact_phone,
			hire_date,
			status
		)
		VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, $16, $17, $18, $19, $20
		)
		RETURNING created_at, updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,

		employee.ID,
		employee.EmployeeNo,

		employee.FirstName,
		employee.MiddleName,
		employee.LastName,
		employee.PreferredName,

		employee.BirthDate,
		employee.Gender,
		employee.Nationality,

		employee.Email,
		employee.Phone,

		employee.Address,
		employee.City,
		employee.Province,
		employee.PostalCode,
		employee.Country,

		employee.EmergencyContactName,
		employee.EmergencyContactPhone,

		employee.HireDate,
		employee.Status,
	).Scan(
		&employee.CreatedAt,
		&employee.UpdatedAt,
	)

	if err != nil {
		if isUniqueViolation(err) {
			return ErrConflict
		}

		return fmt.Errorf("create employee: %w", err)
	}

	return nil
}

func (r *repository) FindByID(
	ctx context.Context,
	id uuid.UUID,
) (*Employee, error) {
	const query = `
		SELECT
			id,
			employee_no,
			first_name,
			middle_name,
			last_name,
			preferred_name,
			birth_date,
			gender,
			nationality,
			email,
			phone,
			address,
			city,
			province,
			postal_code,
			country,
			emergency_contact_name,
			emergency_contact_phone,
			hire_date,
			status,
			created_at,
			updated_at,
			deleted_at
		FROM hr_employee
		WHERE id = $1
		  AND deleted_at IS NULL
	`

	return r.scanOne(ctx, query, id)
}

func (r *repository) FindByEmployeeNo(
	ctx context.Context,
	employeeNo string,
) (*Employee, error) {
	const query = `
		SELECT
			id,
			employee_no,
			first_name,
			middle_name,
			last_name,
			preferred_name,
			birth_date,
			gender,
			nationality,
			email,
			phone,
			address,
			city,
			province,
			postal_code,
			country,
			emergency_contact_name,
			emergency_contact_phone,
			hire_date,
			status,
			created_at,
			updated_at,
			deleted_at
		FROM hr_employee
		WHERE employee_no = $1
		  AND deleted_at IS NULL
	`

	return r.scanOne(ctx, query, employeeNo)
}

func (r *repository) scanOne(
	ctx context.Context,
	query string,
	args ...any,
) (*Employee, error) {
	var employee Employee

	err := r.db.QueryRowContext(
		ctx,
		query,
		args...,
	).Scan(
		&employee.ID,
		&employee.EmployeeNo,

		&employee.FirstName,
		&employee.MiddleName,
		&employee.LastName,
		&employee.PreferredName,

		&employee.BirthDate,
		&employee.Gender,
		&employee.Nationality,

		&employee.Email,
		&employee.Phone,

		&employee.Address,
		&employee.City,
		&employee.Province,
		&employee.PostalCode,
		&employee.Country,

		&employee.EmergencyContactName,
		&employee.EmergencyContactPhone,

		&employee.HireDate,
		&employee.Status,

		&employee.CreatedAt,
		&employee.UpdatedAt,
		&employee.DeletedAt,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrNotFound
	}

	if err != nil {
		return nil, fmt.Errorf("scan employee: %w", err)
	}

	return &employee, nil
}

func (r *repository) List(
	ctx context.Context,
	filter ListFilter,
) ([]Employee, int, error) {
	query := `
		FROM hr_employee
		WHERE deleted_at IS NULL
	`

	args := make([]any, 0)
	argIndex := 1

	if filter.Search != "" {
		query += fmt.Sprintf(`
			AND (
				employee_no ILIKE $%d
				OR first_name ILIKE $%d
				OR last_name ILIKE $%d
				OR email ILIKE $%d
			)
		`, argIndex, argIndex, argIndex, argIndex)

		args = append(args, "%"+filter.Search+"%")
		argIndex++
	}

	if filter.Status != nil {
		query += fmt.Sprintf(
			" AND status = $%d",
			argIndex,
		)

		args = append(args, *filter.Status)
		argIndex++
	}

	var total int

	countQuery := "SELECT COUNT(*) " + query

	if err := r.db.QueryRowContext(
		ctx,
		countQuery,
		args...,
	).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf(
			"count employees: %w",
			err,
		)
	}

	if filter.Limit <= 0 {
		filter.Limit = 20
	}

	if filter.Offset < 0 {
		filter.Offset = 0
	}

	selectQuery := `
		SELECT
			id,
			employee_no,
			first_name,
			middle_name,
			last_name,
			preferred_name,
			birth_date,
			gender,
			nationality,
			email,
			phone,
			address,
			city,
			province,
			postal_code,
			country,
			emergency_contact_name,
			emergency_contact_phone,
			hire_date,
			status,
			created_at,
			updated_at,
			deleted_at
	` + query + fmt.Sprintf(
		" ORDER BY employee_no LIMIT $%d OFFSET $%d",
		argIndex,
		argIndex+1,
	)

	args = append(args, filter.Limit, filter.Offset)

	rows, err := r.db.QueryContext(
		ctx,
		selectQuery,
		args...,
	)
	if err != nil {
		return nil, 0, fmt.Errorf(
			"list employees: %w",
			err,
		)
	}
	defer rows.Close()

	employees := make([]Employee, 0)

	for rows.Next() {
		var employee Employee

		if err := rows.Scan(
			&employee.ID,
			&employee.EmployeeNo,

			&employee.FirstName,
			&employee.MiddleName,
			&employee.LastName,
			&employee.PreferredName,

			&employee.BirthDate,
			&employee.Gender,
			&employee.Nationality,

			&employee.Email,
			&employee.Phone,

			&employee.Address,
			&employee.City,
			&employee.Province,
			&employee.PostalCode,
			&employee.Country,

			&employee.EmergencyContactName,
			&employee.EmergencyContactPhone,

			&employee.HireDate,
			&employee.Status,

			&employee.CreatedAt,
			&employee.UpdatedAt,
			&employee.DeletedAt,
		); err != nil {
			return nil, 0, fmt.Errorf(
				"scan employee list: %w",
				err,
			)
		}

		employees = append(employees, employee)
	}

	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf(
			"iterate employees: %w",
			err,
		)
	}

	return employees, total, nil
}

func (r *repository) Update(
	ctx context.Context,
	employee *Employee,
) error {
	const query = `
		UPDATE hr_employee
		SET
			first_name = $2,
			middle_name = $3,
			last_name = $4,
			preferred_name = $5,
			birth_date = $6,
			gender = $7,
			nationality = $8,
			email = $9,
			phone = $10,
			address = $11,
			city = $12,
			province = $13,
			postal_code = $14,
			country = $15,
			emergency_contact_name = $16,
			emergency_contact_phone = $17,
			hire_date = $18,
			updated_at = NOW()
		WHERE id = $1
		  AND deleted_at IS NULL
		RETURNING updated_at
	`

	err := r.db.QueryRowContext(
		ctx,
		query,
		employee.ID,

		employee.FirstName,
		employee.MiddleName,
		employee.LastName,
		employee.PreferredName,

		employee.BirthDate,
		employee.Gender,
		employee.Nationality,

		employee.Email,
		employee.Phone,

		employee.Address,
		employee.City,
		employee.Province,
		employee.PostalCode,
		employee.Country,

		employee.EmergencyContactName,
		employee.EmergencyContactPhone,

		employee.HireDate,
	).Scan(&employee.UpdatedAt)

	if errors.Is(err, sql.ErrNoRows) {
		return ErrNotFound
	}

	if err != nil {
		return fmt.Errorf("update employee: %w", err)
	}

	return nil
}

func (r *repository) UpdateStatus(
	ctx context.Context,
	id uuid.UUID,
	status EmployeeStatus,
) error {
	const query = `
		UPDATE hr_employee
		SET
			status = $2,
			updated_at = NOW()
		WHERE id = $1
		  AND deleted_at IS NULL
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		id,
		status,
	)
	if err != nil {
		return fmt.Errorf(
			"update employee status: %w",
			err,
		)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf(
			"employee status rows affected: %w",
			err,
		)
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (r *repository) Delete(
	ctx context.Context,
	id uuid.UUID,
) error {
	const query = `
		UPDATE hr_employee
		SET
			deleted_at = NOW(),
			status = 'INACTIVE',
			updated_at = NOW()
		WHERE id = $1
		  AND deleted_at IS NULL
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		id,
	)

	if err != nil {
		return fmt.Errorf(
			"delete employee: %w",
			err,
		)
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf(
			"delete employee rows affected: %w",
			err,
		)
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}
