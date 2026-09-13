import type { eUrlShortener } from "@dkrh/db/schema";

import type {
InferInsertModel,
InferSelectModel,
} from "@dkrh/db";


export type NewEUrlShortener = InferInsertModel<
typeof eUrlShortener

> ;

export type UpdateEUrlShortener = Partial<
InferInsertModel<typeof eUrlShortener>

> ;
