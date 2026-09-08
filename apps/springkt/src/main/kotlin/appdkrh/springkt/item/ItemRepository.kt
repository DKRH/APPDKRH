package appdkrh.springkt.item

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ItemRepository : JpaRepository<Item, UUID> {

    fun existsByNo(no: String): Boolean

    fun existsByNoAndIdNot(
        no: String,
        id: UUID,
    ): Boolean
}