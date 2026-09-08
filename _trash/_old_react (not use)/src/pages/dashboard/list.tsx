import {
    Film,
    Book,
    Gamepad2,
    Music,
    Tv,
    Settings,
    KeyRound,
    FileText,
    NotebookPen,
    Link,
} from "lucide-react";

export const appPages = [
    {
        name: "Entertainment",
        icon: Film,
        to: "/entertainment",
    },
    {
        name: "Passbank",
        icon: KeyRound,
        to: "/passbank",
    },
    {
        name: "Weapon Data",
        icon: KeyRound,
        to: "/i-weapon",
    },
    {
        name: "Note",
        icon: NotebookPen,
        to: "/note",
    },
    {
        name: "URL Shortener",
        icon: Link,
        to: "/url-shortener",
    },
    {
        name: "Text Storage",
        icon: FileText,
        to: "/text-storage",
    },
];