import type { cTodos } from "@dkrh/db/schema";

import type {
InferInsertModel,
InferSelectModel,
} from "@dkrh/db";

export type CTodos = InferSelectModel<
typeof cTodos

> ;

export type NewCTodos = InferInsertModel<
typeof cTodos

> ;

export type UpdateCTodos = Partial<
InferInsertModel<typeof cTodos>

> ;
