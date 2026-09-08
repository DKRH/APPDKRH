using Microsoft.EntityFrameworkCore;

namespace Dotnet.Modules.Customer;

public class CustomerRepository
{
    private readonly CustomerDbContext _db;

    public CustomerRepository(CustomerDbContext db)
    {
        _db = db;
    }

    public async Task<List<Customer>> GetAll(
        string? search,
        CustomerStatus? status,
        int limit,
        int offset)
    {
        var query = _db.Customers
            .Where(x => x.DeletedAt == null);

        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim();

            query = query.Where(x =>
                x.CustomerNo.Contains(search) ||
                x.Name.Contains(search) ||
                (x.Email != null && x.Email.Contains(search)));
        }

        if (status != null)
            query = query.Where(x => x.Status == status);

        return await query
            .OrderBy(x => x.CustomerNo)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<Customer?> GetById(Guid id)
    {
        return await _db.Customers
            .FirstOrDefaultAsync(x =>
                x.Id == id &&
                x.DeletedAt == null);
    }

    public async Task<Customer?> GetByCustomerNo(string customerNo)
    {
        return await _db.Customers
            .FirstOrDefaultAsync(x =>
                x.CustomerNo == customerNo &&
                x.DeletedAt == null);
    }

    public async Task Create(Customer customer)
    {
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
    }

    public async Task Update(Customer customer)
    {
        customer.UpdatedAt = DateTime.UtcNow;

        _db.Customers.Update(customer);
        await _db.SaveChangesAsync();
    }

    public async Task Delete(Customer customer)
    {
        customer.Status = CustomerStatus.Inactive;
        customer.DeletedAt = DateTime.UtcNow;
        customer.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }
}