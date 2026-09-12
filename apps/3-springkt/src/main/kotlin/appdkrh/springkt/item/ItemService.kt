package appdkrh.springkt.item

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class ItemService(
    private val repository: ItemRepository,
) {

    @Transactional(readOnly = true)
    fun findAll(): List<Item> {
        return repository.findAll()
    }

    @Transactional(readOnly = true)
    fun findById(id: UUID): Item {
        return repository.findById(id)
            .orElseThrow {
                IllegalArgumentException("Item not found")
            }
    }

    @Transactional
    fun create(request: ItemRequest): Item {

        if (repository.existsByNo(request.no)) {
            throw IllegalArgumentException("Email already exists")
        }

        val now = OffsetDateTime.now()

        val item = Item(
            no = request.no,
            name = request.name,
            spec = request.spec,
            createdAt = now,
            updatedAt = now,
        )

        return repository.save(item)
    }

    @Transactional
    fun update(
        id: UUID,
        request: ItemRequest,
    ): Item {

        val item = findById(id)

        if (
            repository.existsByNoAndIdNot(
                request.no,
                id,
            )
        ) {
            throw IllegalArgumentException("Email already exists")
        }

        item.no = request.no
        item.name = request.name
        item.spec = request.spec
        item.updatedAt = OffsetDateTime.now()

        return repository.save(item)
    }

    @Transactional
    fun delete(id: UUID) {
        val item = findById(id)

        repository.delete(item)
    }
}