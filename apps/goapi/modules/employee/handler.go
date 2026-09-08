package employee

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/google/uuid"
)

func writeJSON(
	w http.ResponseWriter,
	status int,
	data any,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	_ = json.NewEncoder(w).Encode(data)
}

func writeError(
	w http.ResponseWriter,
	status int,
	err error,
) {
	writeJSON(
		w,
		status,
		map[string]any{
			"error": map[string]any{
				"message": err.Error(),
			},
		},
	)
}

type Handler struct {
	service Service
}

func NewHandler(service Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) List(
	w http.ResponseWriter,
	r *http.Request,
) {
	query := r.URL.Query()

	limit, _ := strconv.Atoi(
		query.Get("limit"),
	)

	offset, _ := strconv.Atoi(
		query.Get("offset"),
	)

	filter := ListFilter{
		Search: query.Get("search"),
		Limit:  limit,
		Offset: offset,
	}

	if status := query.Get("status"); status != "" {
		value := EmployeeStatus(status)
		filter.Status = &value
	}

	employees, total, err := h.service.List(
		r.Context(),
		filter,
	)

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]any{
			"data": employees,
			"meta": map[string]any{
				"total":  total,
				"limit":  limit,
				"offset": offset,
			},
		},
	)
}

func (h *Handler) Get(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := uuid.Parse(
		pathID(r),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid employee id"),
		)
		return
	}

	employee, err := h.service.GetByID(
		r.Context(),
		id,
	)

	if errors.Is(err, ErrNotFound) {
		writeError(
			w,
			http.StatusNotFound,
			err,
		)
		return
	}

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		employee,
	)
}

func (h *Handler) Create(
	w http.ResponseWriter,
	r *http.Request,
) {
	var req CreateEmployeeRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&req); err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid request body"),
		)
		return
	}

	employee, err := h.service.Create(
		r.Context(),
		req,
	)

	if errors.Is(err, ErrConflict) {
		writeError(
			w,
			http.StatusConflict,
			err,
		)
		return
	}

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			err,
		)
		return
	}

	writeJSON(
		w,
		http.StatusCreated,
		employee,
	)
}

func (h *Handler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := uuid.Parse(
		pathID(r),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid employee id"),
		)
		return
	}

	var req UpdateEmployeeRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&req); err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid request body"),
		)
		return
	}

	employee, err := h.service.Update(
		r.Context(),
		id,
		req,
	)

	if errors.Is(err, ErrNotFound) {
		writeError(
			w,
			http.StatusNotFound,
			err,
		)
		return
	}

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			err,
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		employee,
	)
}

func (h *Handler) UpdateStatus(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := uuid.Parse(
		pathID(r),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid employee id"),
		)
		return
	}

	var req UpdateEmployeeStatusRequest

	if err := json.NewDecoder(
		r.Body,
	).Decode(&req); err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid request body"),
		)
		return
	}

	err = h.service.UpdateStatus(
		r.Context(),
		id,
		req.Status,
	)

	if errors.Is(err, ErrNotFound) {
		writeError(
			w,
			http.StatusNotFound,
			err,
		)
		return
	}

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			err,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	id, err := uuid.Parse(
		pathID(r),
	)

	if err != nil {
		writeError(
			w,
			http.StatusBadRequest,
			errors.New("invalid employee id"),
		)
		return
	}

	err = h.service.Delete(
		r.Context(),
		id,
	)

	if errors.Is(err, ErrNotFound) {
		writeError(
			w,
			http.StatusNotFound,
			err,
		)
		return
	}

	if err != nil {
		writeError(
			w,
			http.StatusInternalServerError,
			err,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

mux := http.NewServeMux()

handler := employee.NewHandler(
	employeeService,
)

mux.HandleFunc(
	"GET /api/employees",
	handler.List,
)

mux.HandleFunc(
	"POST /api/employees",
	handler.Create,
)

mux.HandleFunc(
	"GET /api/employees/{id}",
	handler.Get,
)

mux.HandleFunc(
	"PUT /api/employees/{id}",
	handler.Update,
)

mux.HandleFunc(
	"PATCH /api/employees/{id}/status",
	handler.UpdateStatus,
)

mux.HandleFunc(
	"DELETE /api/employees/{id}",
	handler.Delete,
)
func pathID(r *http.Request) string {
	return r.PathValue("id")
}