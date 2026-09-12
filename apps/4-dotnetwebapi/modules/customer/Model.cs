using Microsoft.EntityFrameworkCore;

namespace Dotnet.Modules.Customer;

public enum CustomerStatus
{
    Active,
    Inactive
}

public class Customer
{
    public Guid Id { get; set; }

    public string CustomerNo { get; set; } = "";
    public string Name { get; set; } = "";

    public string? Email { get; set; }
    public string? Phone { get; set; }

    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }

    public CustomerStatus Status { get; set; } = CustomerStatus.Active;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}

public class CustomerDbContext : DbContext
{
    public CustomerDbContext(DbContextOptions<CustomerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers => Set<Customer>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("customers");

            entity.HasKey(x => x.Id);

            entity.Property(x => x.Id)
                .HasColumnName("id");

            entity.Property(x => x.CustomerNo)
                .HasColumnName("customer_no")
                .IsRequired();

            entity.HasIndex(x => x.CustomerNo)
                .IsUnique();

            entity.Property(x => x.Name)
                .HasColumnName("name")
                .IsRequired();

            entity.Property(x => x.Email)
                .HasColumnName("email");

            entity.Property(x => x.Phone)
                .HasColumnName("phone");

            entity.Property(x => x.Address)
                .HasColumnName("address");

            entity.Property(x => x.City)
                .HasColumnName("city");

            entity.Property(x => x.Country)
                .HasColumnName("country");

            entity.Property(x => x.Status)
                .HasColumnName("status")
                .HasConversion<string>();

            entity.Property(x => x.CreatedAt)
                .HasColumnName("created_at");

            entity.Property(x => x.UpdatedAt)
                .HasColumnName("updated_at");

            entity.Property(x => x.DeletedAt)
                .HasColumnName("deleted_at");
        });
    }
}