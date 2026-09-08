package appdkrh.springkt.item

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/item")
class ItemController(
    private val service: ItemService,
) {

    @GetMapping
    fun findAll(): List<Item> {
        return service.findAll()
    }

    @GetMapping("/{id}")
    fun findById(
        @PathVariable id: UUID,
    ): Item {
        return service.findById(id)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(
        @RequestBody request: ItemRequest,
    ): Item {
        return service.create(request)
    }

    @PutMapping("/{id}")
    fun update(
        @PathVariable id: UUID,
        @RequestBody request: ItemRequest,
    ): Item {
        return service.update(id, request)
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(
        @PathVariable id: UUID,
    ) {
        service.delete(id)
    }
}