package password

import (
	"context"

	"github.com/uptrace/bun"
)

type Repository struct {
	db *bun.DB
}

func NewRepository(db *bun.DB) *Repository {
	return &Repository{
		db: db,
	}
}

// ================================
// PASSWORD
// ================================

func (r *Repository) Create(
	ctx context.Context,
	password *PasswordEntry,
) error {
	_, err := r.db.NewInsert().
		Model(password).
		Exec(ctx)

	return err
}

func (r *Repository) GetAll(
	ctx context.Context,
) ([]PasswordEntry, error) {
	var passwords []PasswordEntry

	err := r.db.NewSelect().
		Model(&passwords).
		Relation("Group").
		OrderExpr("password_entry.id DESC").
		Scan(ctx)

	return passwords, err
}

func (r *Repository) GetByID(
	ctx context.Context,
	id int64,
) (*PasswordEntry, error) {
	password := new(PasswordEntry)

	err := r.db.NewSelect().
		Model(password).
		Relation("Group").
		Where("password_entry.id = ?", id).
		Scan(ctx)

	return password, err
}

func (r *Repository) Update(
	ctx context.Context,
	password *PasswordEntry,
) error {
	_, err := r.db.NewUpdate().
		Model(password).
		WherePK().
		Column(
			"group_id",
			"title",
			"username",
			"password",
			"url",
			"notes",
		).
		Exec(ctx)

	return err
}

func (r *Repository) Delete(
	ctx context.Context,
	id int64,
) error {
	_, err := r.db.NewDelete().
		Model((*PasswordEntry)(nil)).
		Where("id = ?", id).
		Exec(ctx)

	return err
}

// ================================
// PASSWORD GROUP
// ================================

func (r *Repository) CreateGroup(
	ctx context.Context,
	group *PasswordGroup,
) error {
	_, err := r.db.NewInsert().
		Model(group).
		Exec(ctx)

	return err
}

func (r *Repository) GetAllGroups(
	ctx context.Context,
) ([]PasswordGroup, error) {
	var groups []PasswordGroup

	err := r.db.NewSelect().
		Model(&groups).
		OrderExpr("password_group.id DESC").
		Scan(ctx)

	return groups, err
}

func (r *Repository) GetGroupByID(
	ctx context.Context,
	id int64,
) (*PasswordGroup, error) {
	group := new(PasswordGroup)

	err := r.db.NewSelect().
		Model(group).
		Where("password_group.id = ?", id).
		Scan(ctx)

	return group, err
}

func (r *Repository) UpdateGroup(
	ctx context.Context,
	group *PasswordGroup,
) error {
	_, err := r.db.NewUpdate().
		Model(group).
		WherePK().
		Column("name").
		Exec(ctx)

	return err
}

func (r *Repository) DeleteGroup(
	ctx context.Context,
	id int64,
) error {
	_, err := r.db.NewDelete().
		Model((*PasswordGroup)(nil)).
		Where("id = ?", id).
		Exec(ctx)

	return err
}
