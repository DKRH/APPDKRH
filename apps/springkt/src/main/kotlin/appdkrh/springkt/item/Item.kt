package appdkrh.springkt.item

import jakarta.persistence.*
import java.time.OffsetDateTime
import java.util.UUID

@Entity
@Table(name = "item")
class Item(

    @Id
    @GeneratedValue
    @Column(nullable = false)
    var id: UUID? = null,

    @Column(nullable = false, unique = true)
    var no: String = "",

    @Column(nullable = false)
    var name: String = "",

    @Column(nullable = false)
    var spec: String = "",

    @Column(name = "created_at", nullable = false)
    var createdAt: OffsetDateTime? = null,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: OffsetDateTime? = null,
)