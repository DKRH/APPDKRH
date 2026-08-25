package password

import (
	"time"

	"github.com/uptrace/bun"
)

type PasswordEntry struct {
	bun.BaseModel `bun:"table:password_entries"`

	ID      int64  `bun:",pk,autoincrement" json:"id"`
	GroupID *int64 `bun:"group_id" json:"group_id"`

	Title    string `json:"title"`
	Username string `json:"username"`
	Password string `json:"password"`
	URL      string `json:"url"`
	Notes    string `json:"notes"`

	Group *PasswordGroup `bun:"rel:belongs-to,join:group_id=id" json:"group,omitempty"`

	CreatedAt time.Time `bun:"created_at,nullzero,notnull,default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time `bun:"updated_at,nullzero,notnull,default:current_timestamp" json:"updated_at"`
}

type PasswordGroup struct {
	bun.BaseModel `bun:"table:password_groups"`

	ID   int64  `bun:",pk,autoincrement" json:"id"`
	Name string `bun:"notnull" json:"name"`

	Passwords []PasswordEntry `bun:"rel:has-many,join:id=group_id" json:"passwords,omitempty"`

	CreatedAt time.Time `bun:"created_at,notnull,default:current_timestamp" json:"created_at"`
	UpdatedAt time.Time `bun:"updated_at,notnull,default:current_timestamp" json:"updated_at"`
}
