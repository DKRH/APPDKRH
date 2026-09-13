import type {
dNotes,
dLabels,
dJNoteLabels,
} from "@dkrh/db/schema";

import type {
InferInsertModel,
InferSelectModel,
} from "@dkrh/db";

export type DNotes = InferSelectModel<
typeof dNotes

> ;

export type NewDNotes = InferInsertModel<
typeof dNotes

> ;

export type UpdateDNotes = Partial<
InferInsertModel<typeof dNotes>

> ;

export type DLabels = InferSelectModel<
typeof dLabels

> ;

export type DJNoteLabels = InferSelectModel<
typeof dJNoteLabels

> ;

export type NewDJNoteLabels = InferInsertModel<
typeof dJNoteLabels

> ;

export type UpdateDJNoteLabels = Partial<
InferInsertModel<typeof dJNoteLabels>

> ;

export type DNoteWithLabels = DNotes & {
labels: DLabels[];
};

export type NewDNoteWithLabels = NewDNotes & {
labelIds?: string[];
};

export type UpdateDNoteWithLabels = UpdateDNotes & {
labelIds?: string[];
};
