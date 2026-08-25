package password

type CreatePasswordRequest struct {
	GroupID  *int64 `json:"group_id"`
	Title    string `json:"title" binding:"required"`
	Username string `json:"username"`
	Password string `json:"password" binding:"required"`
	URL      string `json:"url"`
	Notes    string `json:"notes"`
}

type UpdatePasswordRequest struct {
	GroupID  *int64 `json:"group_id"`
	Title    string `json:"title"`
	Username string `json:"username"`
	Password string `json:"password"`
	URL      string `json:"url"`
	Notes    string `json:"notes"`
}

type CreatePasswordGroupRequest struct {
	Name string `json:"name" binding:"required"`
}

type UpdatePasswordGroupRequest struct {
	Name string `json:"name" binding:"required"`
}
