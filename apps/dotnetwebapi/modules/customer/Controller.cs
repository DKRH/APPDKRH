using Microsoft.AspNetCore.Mvc;

namespace Dotnet.Modules.Customer;

[ApiController]
[Route("api/customers")]
public class CustomerController : ControllerBase
{
    private readonly CustomerService _service;

    public CustomerController(CustomerService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateCustomerRequest req)
    {
        try
        {
            var customer = await _service.Create(req);

            return CreatedAtAction(
                nameof(GetById),
                new { id = customer.Id },
                customer);
        }
        catch (Exception ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] CustomerStatus? status,
        [FromQuery] int limit = 20,
        [FromQuery] int offset = 0)
    {
        var customers = await _service.GetAll(
            search,
            status,
            limit,
            offset);

        return Ok(customers);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var customer = await _service.GetById(id);

        return customer == null
            ? NotFound(new { error = "customer not found" })
            : Ok(customer);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        UpdateCustomerRequest req)
    {
        var customer = await _service.Update(id, req);

        return customer == null
            ? NotFound(new { error = "customer not found" })
            : Ok(customer);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(
        Guid id,
        UpdateCustomerStatusRequest req)
    {
        if (!Enum.IsDefined(req.Status))
            return BadRequest(new { error = "invalid customer status" });

        var updated = await _service.UpdateStatus(
            id,
            req.Status);

        return updated
            ? NoContent()
            : NotFound(new { error = "customer not found" });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.Delete(id);

        return deleted
            ? NoContent()
            : NotFound(new { error = "customer not found" });
    }
}