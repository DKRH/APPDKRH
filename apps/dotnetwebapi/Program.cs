using Dapper;
using DotNetEnv;
using Npgsql;

var repoRoot = Path.GetFullPath(
    Path.Combine(AppContext.BaseDirectory, "../../../../..")
);
Console.WriteLine($"repoRoot: {repoRoot}");
Env.Load(Path.Combine(repoRoot, ".env"));

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DOTNET_DATABASE_URL")
    ?? throw new InvalidOperationException("DATABASE_URL is not configured.");

builder.Services.AddSingleton(new NpgsqlDataSourceBuilder(connectionString).Build());

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.WebHost.UseUrls("http://0.0.0.0:2604");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/", () => new { message = "Hello from .NET" });

// GET all
app.MapGet("/users", async (NpgsqlDataSource db) =>
{
    await using var connection = await db.OpenConnectionAsync();

    var users = await connection.QueryAsync<User>(
        """
        SELECT
            id,
            name,
            email,
            created_at AS CreatedAt
        FROM users
        ORDER BY created_at DESC
        """
    );

    return Results.Ok(users);
});

// GET one
app.MapGet("/users/{id:guid}", async (
    Guid id,
    NpgsqlDataSource db
) =>
{
    await using var connection = await db.OpenConnectionAsync();

    var user = await connection.QuerySingleOrDefaultAsync<User>(
        """
        SELECT
            id,
            name,
            email,
            created_at AS CreatedAt
        FROM users
        WHERE id = @id
        """,
        new { id }
    );

    return user is null
        ? Results.NotFound()
        : Results.Ok(user);
});

// CREATE
app.MapPost("/users", async (
    CreateUserRequest request,
    NpgsqlDataSource db
) =>
{
    await using var connection = await db.OpenConnectionAsync();

    var user = await connection.QuerySingleAsync<User>(
        """
        INSERT INTO users (name, email)
        VALUES (@Name, @Email)
        RETURNING
            id,
            name,
            email,
            created_at AS CreatedAt
        """,
        request
    );

    return Results.Created($"/users/{user.Id}", user);
});

// UPDATE
app.MapPut("/users/{id:guid}", async (
    Guid id,
    UpdateUserRequest request,
    NpgsqlDataSource db
) =>
{
    await using var connection = await db.OpenConnectionAsync();

    var user = await connection.QuerySingleOrDefaultAsync<User>(
        """
        UPDATE users
        SET
            name = @Name,
            email = @Email
        WHERE id = @Id
        RETURNING
            id,
            name,
            email,
            created_at AS CreatedAt
        """,
        new
        {
            Id = id,
            request.Name,
            request.Email
        }
    );

    return user is null
        ? Results.NotFound()
        : Results.Ok(user);
});

// DELETE
app.MapDelete("/users/{id:guid}", async (
    Guid id,
    NpgsqlDataSource db
) =>
{
    await using var connection = await db.OpenConnectionAsync();

    var affected = await connection.ExecuteAsync(
        """
        DELETE FROM users
        WHERE id = @id
        """,
        new { id }
    );

    return affected == 0
        ? Results.NotFound()
        : Results.NoContent();
});

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}


public sealed record User(
    Guid Id,
    string Name,
    string Email,
    DateTime CreatedAt
);

public sealed record CreateUserRequest(
    string Name,
    string Email
);

public sealed record UpdateUserRequest(
    string Name,
    string Email
);