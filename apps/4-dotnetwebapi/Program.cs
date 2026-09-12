using DotNetEnv;
using Dotnet.Modules.Customer;
using Microsoft.EntityFrameworkCore;

var repoRoot = Path.GetFullPath(
    Path.Combine(AppContext.BaseDirectory, "../../../../..")
);

Env.Load(Path.Combine(repoRoot, ".env"));

var builder = WebApplication.CreateBuilder(args);

var connectionString = Environment.GetEnvironmentVariable("DOTNET_DATABASE_URL")
    ?? throw new InvalidOperationException(
        "DOTNET_DATABASE_URL is not configured."
    );

builder.Services.AddDbContext<CustomerDbContext>(options => options.UseNpgsql(connectionString));

builder.Services.AddScoped<CustomerRepository>();
builder.Services.AddScoped<CustomerService>();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.WebHost.UseUrls("http://0.0.0.0:2604");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.MapGet("/", () => new
{
    message = "DKRH API DotNet Web Api"
});

app.Run();