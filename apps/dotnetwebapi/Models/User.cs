namespace Dotnet.Models;

public sealed record User(
    Guid Id,
    string Name,
    string Email,
    DateTime CreatedAt
);