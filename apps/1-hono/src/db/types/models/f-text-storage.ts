import type { fTextStorage } from "@dkrh/db/schema";

import type {
InferInsertModel,
InferSelectModel,
} from "@dkrh/db";

export type FTextStorage = InferSelectModel<
typeof fTextStorage

> ;

export type NewFTextStorage = InferInsertModel<
typeof fTextStorage

> ;

export type UpdateFTextStorage = Partial<
InferInsertModel<typeof fTextStorage>

> ;
