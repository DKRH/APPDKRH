import type { dLabels } from "@dkrh/db/schema";

import type {
InferInsertModel,
InferSelectModel,
} from "@dkrh/db";


export type NewDLabels = InferInsertModel<
typeof dLabels

> ;

export type UpdateDLabels = Partial<
InferInsertModel<typeof dLabels>

> ;
