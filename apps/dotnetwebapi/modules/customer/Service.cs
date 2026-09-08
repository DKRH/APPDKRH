namespace Dotnet.Modules.Customer;

public class CustomerService
{
    private readonly CustomerRepository _repo;

    public CustomerService(CustomerRepository repo)
    {
        _repo = repo;
    }

    public async Task<Customer> Create(CreateCustomerRequest req)
    {
        var existing = await _repo.GetByCustomerNo(req.CustomerNo);

        if (existing != null)
            throw new Exception("customer already exists");

        var customer = new Customer
        {
            Id = Guid.NewGuid(),
            CustomerNo = req.CustomerNo.Trim(),
            Name = req.Name.Trim(),

            Email = req.Email,
            Phone = req.Phone,

            Address = req.Address,
            City = req.City,
            Country = req.Country,

            Status = CustomerStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repo.Create(customer);

        return customer;
    }

    public async Task<Customer?> GetById(Guid id)
    {
        return await _repo.GetById(id);
    }

    public async Task<List<Customer>> GetAll(
        string? search,
        CustomerStatus? status,
        int limit,
        int offset)
    {
        limit = Math.Clamp(limit, 1, 100);
        offset = Math.Max(offset, 0);

        return await _repo.GetAll(
            search,
            status,
            limit,
            offset);
    }

    public async Task<Customer?> Update(
        Guid id,
        UpdateCustomerRequest req)
    {
        var customer = await _repo.GetById(id);

        if (customer == null)
            return null;

        customer.Name = req.Name.Trim();

        customer.Email = req.Email;
        customer.Phone = req.Phone;

        customer.Address = req.Address;
        customer.City = req.City;
        customer.Country = req.Country;

        await _repo.Update(customer);

        return customer;
    }

    public async Task<bool> UpdateStatus(
        Guid id,
        CustomerStatus status)
    {
        var customer = await _repo.GetById(id);

        if (customer == null)
            return false;

        customer.Status = status;

        await _repo.Update(customer);

        return true;
    }

    public async Task<bool> Delete(Guid id)
    {
        var customer = await _repo.GetById(id);

        if (customer == null)
            return false;

        await _repo.Delete(customer);

        return true;
    }
}

public record CreateCustomerRequest(
    string CustomerNo,
    string Name,
    string? Email,
    string? Phone,
    string? Address,
    string? City,
    string? Country
);

public record UpdateCustomerRequest(
    string Name,
    string? Email,
    string? Phone,
    string? Address,
    string? City,
    string? Country
);

public record UpdateCustomerStatusRequest(
    CustomerStatus Status
);