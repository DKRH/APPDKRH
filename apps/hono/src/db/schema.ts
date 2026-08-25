import {
	sqliteTable,
	text,
	integer,
	real,
  	index,
		uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { boolean, decimal, timestamp, uuid, uuidkey, varchar } from "./drizzle-sqlite-helper";
import { randomUUID, } from "crypto";

export const a_user = sqliteTable("a_user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", {
    mode: "boolean",
  })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", {
    mode: "timestamp",
  }).notNull(),
  updatedAt: integer("updated_at", {
    mode: "timestamp",
  }).notNull(),
});
export const a_session = sqliteTable(
  "a_session",
  {
    id: text("id").primaryKey(),

    expiresAt: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),

    token: text("token").notNull().unique(),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),

    ipAddress: text("ip_address"),

    userAgent: text("user_agent"),

    userId: text("user_id")
      .notNull()
      .references(() => a_user.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    index("session_userId_idx").on(
      table.userId,
    ),
],
);
export const a_account = sqliteTable(
  "a_account",
  {
    id: text("id").primaryKey(),

    accountId: text("account_id").notNull(),

    providerId: text("provider_id").notNull(),

    userId: text("user_id")
      .notNull()
      .references(() => a_user.id, {
        onDelete: "cascade",
      }),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),

    accessTokenExpiresAt: integer(
      "access_token_expires_at",
      {
        mode: "timestamp",
      },
    ),

    refreshTokenExpiresAt: integer(
      "refresh_token_expires_at",
      {
        mode: "timestamp",
      },
    ),

    scope: text("scope"),

    password: text("password"),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),
  },
  (table) => [
    index("account_userId_idx").on(
      table.userId,
    ),
  ],
);
export const a_verification = sqliteTable(
  "a_verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),

    value: text("value").notNull(),

    expiresAt: integer("expires_at", {
      mode: "timestamp",
    }).notNull(),

    createdAt: integer("created_at", {
      mode: "timestamp",
    }).notNull(),

    updatedAt: integer("updated_at", {
      mode: "timestamp",
    }).notNull(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
  ],
);

const auditColumns = {
	id: uuidkey("id"),
	createdAt: timestamp("created_at").notNull()
		.$defaultFn(() => new Date() ), 
	updatedAt: timestamp("updated_at").notNull()
		.$defaultFn(() => new Date() )
		.$onUpdate(() => new Date() ), 
	deletedAt: timestamp("deleted_at"), 
	createdBy: text("created_by"), 
	updatedBy: text("updated_by"), 
	deletedBy: text("deleted_by")
};

export const b_passbank = sqliteTable("b_passbank", {
	...auditColumns,
	title: text().notNull(),
	username: text(),
	password: text(),
	note: text(),
});

export const c_weapons = sqliteTable("c_weapons", {
	...auditColumns,
	status: text("status").default("unreleased"), // active, pending, replacing, unreleased, released, legacy, etc
	group: text("group").notNull(), // AR, SMG, etc
	classname: text("classname").notNull(), // weapon's classname, e.g. "weapon_br_ak47"
	printname: text("printname").notNull(), // weapon's print name, e.g. "AK-47"
	weaponType: text("weapon_type"),
	damage: integer("damage"),
	cycleTime: real("cycle_time"),
	range: integer("range"),
	rangeModifier: real("range_modifier"),
	penetration: integer("penetration"),
	clipSize: integer("clip_size").default(30),
	defaultClip: integer("default_clip"),
	weight: integer("weight"),
	viewmodel: text("viewmodel"),
	playermodel: text("playermodel"),
	primaryAmmo: text("primary_ammo"),
	weaponPrice: integer("weapon_price"),
	fullAuto: integer("full_auto"),
	dateAdded: text("date_added"),

	flag: text("flag").default("WF_NONE"),
	caliberAmmo: text("caliber_ammo"),
	firingMode: text("firing_mode").default("AUTO"),
	credit: integer("credit"),
	source: text("source"),
	checkVMDL: integer("check_vmdl"),
	checkWMDL: integer("check_wmdl"),
	checkSFX: integer("check_sfx"),
	checkAnims: integer("check_anims"),
	checkInspect: integer("check_inspect"),
	checkADS: integer("check_ads"),
	checkTacReload: integer("check_tac_reload"),
	check2ndHand: integer("check_2nd_hand"),
	checkBuyMenuPic: integer("check_buy_menu_pic"),
	checkHUDIcon: integer("check_hud_icon"),
});

export const dTodos = sqliteTable("b_todos", {
	...auditColumns,
	name: text().notNull(),
	isComplete: boolean("is_complete").notNull().default(false),
});
export const dNotes = sqliteTable("c_notes", {
	...auditColumns,
	title: text().notNull(),
	content: text(),
	isPinned: boolean("is_pinned").notNull().default(false),
	isArchived: boolean("is_archived").notNull().default(false),
});
export const dLabels = sqliteTable("c_labels", {
	...auditColumns,
	name: text().notNull(),
});
export const dJNoteLabels = sqliteTable("c_j_note_labels", {
	...auditColumns,

	noteId: uuid("note_id")
		.notNull()
		.references(() => dNotes.id),

	labelId: uuid("label_id")
		.notNull()
		.references(() => dLabels.id),
});
export const eUrlShortener = sqliteTable("e_url_shortener", {
	...auditColumns,

	originalURL: text("original_url").notNull(),
	shortenURL: text("shorten_url").notNull(),

	isLocked: boolean("is_locked").default(false).notNull(),

	password: text("password"),
	expireDateUTC: timestamp("expire_date"),
});
export const fTextStorage = sqliteTable("f_text_storage", {
	...auditColumns,

	url: text("url").notNull(),
	content: text("content").notNull(),

	isLocked: boolean("is_locked").default(false).notNull(),
	isExpire: boolean("is_expire").default(false).notNull(),

	password: text("password"),
	expireDateUTC: timestamp("expire_date"),
});
export const gGameWhitelist = sqliteTable("g_game_whitelist", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc").notNull(),

	releaseDate: text("release_date").notNull(),

	platformId: uuid("platform_id").notNull(),
});
export const gGamePlatform = sqliteTable("g_game_platform", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc").notNull(),
});
export const gJGameWhitelistPlatform = sqliteTable("g_j_game_whitelist_platform",{
		...auditColumns,
		whitelistId: uuid("whitelist_id")
			.notNull()
			.references(() => gGameWhitelist.id, { onDelete: "cascade" }),

		platformId: uuid("platform_id")
			.notNull()
			.references(() => gGamePlatform.id, { onDelete: "cascade" }),

		note: text("note"),
	},
	(table) => [
		uniqueIndex("uq_whitelist_platform").on(
			table.whitelistId,
			table.platformId,
		),
	]
);
export const hEntertainmentTrackerType = sqliteTable(
	"g_entertainment_tracker_type",
	{
		...auditColumns,
		name: text("name").notNull(),
		desc: text("desc"),
	},
);
export const hEntertainmentTracker = sqliteTable("g_entertainment_tracker", {
	...auditColumns,

	typeId: uuid("type_id")
		.notNull()
		.references(() => hEntertainmentTrackerType.id),

	franchiseTitle: text("franchise_title"),
	entryTitle: text("entry_title").notNull(),
	season: text("season"),
	year: text("year"),

	statusPublication: text("status_publication"),
	statusDL: text("status_dl"),
	linkDL: text("link_dl"),
	lastMark: text("last_mark"),
});
export const iWeaponOrigins = sqliteTable("i_weapon_origins", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc"),
});
export const iWeaponCalibers = sqliteTable("i_weapon_calibers", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc"),
});
export const iWeaponClasses = sqliteTable("i_weapon_classes", {
	...auditColumns,

	type: text("type").notNull(),
	name: text("name").notNull(),
	desc: text("desc"),
});
export const iWeapons = sqliteTable("i_weapons", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc"),

	originId: uuid("origin_id")
		.notNull()
		.references(() => iWeaponOrigins.id),

	caliberId: uuid("caliber_id")
		.notNull()
		.references(() => iWeaponCalibers.id),

	classId: uuid("class_id")
		.notNull()
		.references(() => iWeaponClasses.id),
});
export const iWeaponRefs = sqliteTable("i_weapon_refs", {
	...auditColumns,

	name: text("name").notNull(),
	desc: text("desc"),

	originId: uuid("origin_id")
		.notNull()
		.references(() => iWeaponOrigins.id),

	caliberId: uuid("caliber_id")
		.notNull()
		.references(() => iWeaponCalibers.id),

	weaponId: uuid("weapon_id")
		.notNull()
		.references(() => iWeapons.id),
});

export const kMAttributes = sqliteTable("k_m_attributes", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const kMRoles = sqliteTable("k_m_roles", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const kMUniverses = sqliteTable("k_m_universes", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const kMWeapons = sqliteTable("k_m_weapons", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const kMCharacters = sqliteTable("k_m_characters", {
	...auditColumns,

	name: text("name").notNull(),

	weaponId: uuid("wp_id").references(() => kMWeapons.id),

	universeId: uuid("universe_id")
		.notNull()
		.references(() => kMUniverses.id),

	attributeId: uuid("attribute_id")
		.notNull()
		.references(() => kMAttributes.id),
});

export const kJCharacterRole = sqliteTable(
	"k_j_character_role",
	{
		...auditColumns,

		characterId: uuid("character_id")
			.notNull()
			.references(() => kMCharacters.id),

		roleId: uuid("role_id")
			.notNull()
			.references(() => kMRoles.id),
	},
	(table) => ({
		uniqueCharacterRole: uniqueIndex("uq_character_role").on(
			table.characterId,
			table.roleId,
		),
	}),
);

export const kDImages = sqliteTable("k_d_images", {
	...auditColumns,

	characterId: uuid("character_id")
		.notNull()
		.references(() => kMCharacters.id),

	type: text("type").notNull(), // splash, portrait, icon, skin
	url: text("url").notNull(),
	order: integer("order"), // optional display order
});
export const kDVoiceLines = sqliteTable("k_d_voice_lines", {
	...auditColumns,

	characterId: uuid("character_id")
		.notNull()
		.references(() => kMCharacters.id),

	title: text("title").notNull(), // e.g. "On Battle Start"
	audioUrl: text("audio_url").notNull(),
	transcript: text("transcript"), // optional subtitles
});
export const kDStories = sqliteTable("k_d_stories", {
	...auditColumns,

	characterId: uuid("character_id")
		.notNull()
		.references(() => kMCharacters.id),

	title: text("title").notNull(),
	content: text("content").notNull(),
	unlockCondition: text("unlock_condition"), // e.g. level 40, bond 3
});

export const kMCombatSkillTypes = sqliteTable("k_m_combat_skill_types", {
	...auditColumns,
	code: text("code").notNull(), // basic, heavy, skill, ultimate
	name: text("name").notNull(), // display name: Basic Attack, Ultimate, etc.
	desc: text("desc"),
});

export const kDCombatSkills = sqliteTable("k_d_combat_skills", {
	...auditColumns,

	characterId: uuid("character_id")
		.notNull()
		.references(() => kMCharacters.id),

	skillTypeId: uuid("skill_type_id")
		.notNull()
		.references(() => kMCombatSkillTypes.id),

	name: text("name").notNull(),
	desc: text("desc").notNull(),
});

export const kMMaterials = sqliteTable("k_m_materials", {
	...auditColumns,
	type: text("type").notNull(), // Boss, Common, Favorite
	name: text("name").notNull(),
	desc: text("desc"),
	rarity: text("rarity"), // optional (common, rare, epic)
});

export const kMAscensionPhases = sqliteTable("k_m_ascension_phases", {
	...auditColumns,

	phase: integer("phase").notNull(), // 1,2,3...
	levelCap: integer("level_cap").notNull(), // 20,40,50...
	bossMatQty: integer("boss_material_quantity").notNull().default(0),
	commonMatQty: integer("common_material_quantity").notNull().default(0),
	favoriteMatQty: integer("favorite_material_quantity").notNull().default(0),
	currency: integer("currency").notNull().default(0),
});

export const kDCharacterAscension = sqliteTable("k_d_character_ascension", {
	...auditColumns,

	characterId: uuid("character_id")
		.notNull()
		.references(() => kMCharacters.id),

	ascensionPhaseId: uuid("ascension_phase_id")
		.notNull()
		.references(() => kMAscensionPhases.id),

	bossMatId: uuid("boss_material_id")
		.notNull()
		.references(() => kMMaterials.id),

	commonMatId: uuid("common_material_id")
		.notNull()
		.references(() => kMMaterials.id),

	favoriteMatId: uuid("favorite_material_id")
		.notNull()
		.references(() => kMMaterials.id),
});

export const kMLevelingExp = sqliteTable("k_m_leveling_exp", {
	...auditColumns,
	level: integer("level").notNull(), // 1,2,3...
	expNeed: integer("exp_need").notNull(),
});

export const mTCGFamilia = sqliteTable("m_tcg_familia", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const mTCGCardType = sqliteTable("m_tcg_card_type", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const mTCGSupertype = sqliteTable("m_tcg_supertype", {
	...auditColumns,
	name: text("name").notNull(),
	desc: text("desc"),
});

export const mTCGElement = sqliteTable("m_tcg_element", {
	...auditColumns,
	code: text("code").notNull(),
	name: text("name").notNull(),
	desc: text("desc"),
});

export const mTCGKeyword = sqliteTable("m_tcg_keyword", {
	...auditColumns,
	code: text("code").notNull(),
	name: text("name").notNull(),
	desc: text("desc"),
});

export const mTCGCards = sqliteTable("m_tcg_cards", {
	...auditColumns,
	name: text("name").notNull(),
	imageUrl: text("image_url"),

	power: integer("power"),
	toughness: integer("toughness"),

	supertypeId1: uuid("supertype_id_1")
		.notNull()
		.references(() => mTCGSupertype.id),
	supertypeId2: uuid("supertype_id_2")
		.notNull()
		.references(() => mTCGSupertype.id),
	cardTypeId: uuid("card_type_id")
		.notNull()
		.references(() => mTCGCardType.id),
	familiaId1: uuid("familia_id_1")
		.notNull()
		.references(() => mTCGFamilia.id),
	familiaId2: uuid("familia_id_2")
		.notNull()
		.references(() => mTCGFamilia.id),
	familiaId3: uuid("familia_id_3")
		.notNull()
		.references(() => mTCGFamilia.id),

	castCost: text("cast_cost"), //element / sacrifice / etc
	effect: text("effect"),
});

export const nGachaUserHistory = sqliteTable("n_gacha_user_history", {
	...auditColumns,
	userId: uuid("user_id")
		.notNull()
		.references(() => a_user.id),

	itemId: uuid("item_id")
		.notNull()
		.references(() => nGachaItems.id),
	name: text("name"),
	rarity: integer("rarity"),
	obtainedAt: timestamp("obtained_at").defaultNow().notNull(),
});
export const nGachaUserPity = sqliteTable("n_gacha_user_pity", {
	...auditColumns,
	userId: uuid("user_id")
		.notNull()
		.references(() => a_user.id),
	pity5: integer("pity5").default(0),
	pity4: integer("pity4").default(0),
	guarantee5: integer("guarantee5").default(0),
});
export const nGachaItems = sqliteTable("n_gacha_items", {
	...auditColumns,
	name: text("name"),
	rarity: integer("rarity"),
	imageUrl: text("image_url"),
	videoUrl: text("video_url"),
});
export const nGachaBanners = sqliteTable("n_gacha_banners", {
	...auditColumns,
	name: text("name"),
	softPityStart: integer("soft_pity_start"),
	hardPityStart: integer("hard_pity_start"),
	uprate5: integer("uprate5"),
	uprate4: integer("uprate4"),
});
export const nGachaBannerItems = sqliteTable("n_gacha_banner_items", {
	...auditColumns,
	bannerId: uuid("banner_id")
		.notNull()
		.references(() => nGachaBanners.id),
	itemId: uuid("item_id")
		.notNull()
		.references(() => nGachaItems.id),
});

export const oUoms = sqliteTable("o_uoms", {
	...auditColumns,
	code: varchar("code", { length: 30 }).notNull().unique(),
	name: text("name").notNull(),
});
export const oCategories = sqliteTable("o_categories", {
	...auditColumns,
	code: varchar("code", { length: 30 }).notNull().unique(),
	name: text("name").notNull(),
});
export const oItems = sqliteTable("o_items", {
	...auditColumns,

	code: varchar("code", { length: 30 }).notNull().unique(),
	name: text("name").notNull(),
	
	inventoryType: text("inventory_type").notNull(), // stock | non_stock | service
	type: text("type").notNull(), // raw material, component, finished good, sample

	parentItemId: uuid("parent_item_id"),
});
export const oItemVariants = sqliteTable(
	"o_item_variants",
	{
		...auditColumns,

		itemId: uuid("item_id")
			.notNull()
			.references(() => oItems.id, { onDelete: "cascade" }),

		variantName: text("variant_name").notNull(),

		length: decimal("length", { precision: 10, scale: 2 }),
		width: decimal("width", { precision: 10, scale: 2 }),
		height: decimal("height", { precision: 10, scale: 2 }),
		weight: decimal("weight", { precision: 10, scale: 2 }),
	},
	(table) => [
		uniqueIndex("uniqueVariant").on(table.itemId, table.variantName),
	],
);
export const oItemUoms = sqliteTable(
	"o_item_uoms",
	{
		...auditColumns,

		itemId: uuid("item_id")
			.notNull()
			.references(() => oItems.id, { onDelete: "cascade" }),

		uomId: uuid("uom_id")
			.notNull()
			.references(() => oUoms.id, { onDelete: "cascade" }),

		conversionValue: decimal("conversion_value", {
			precision: 12,
			scale: 6,
		}).notNull(),

		isDefault: boolean("is_default").default(false),
	},
	(table) => [
		uniqueIndex("uniqueItemUom").on(table.itemId, table.uomId),
	],
);
export const oBoms = sqliteTable(
	"o_boms",
	{
		...auditColumns,

		itemVariantId: uuid("item_variant_id")
			.notNull()
			.references(() => oItemVariants.id, { onDelete: "cascade" }),

		version: text("version").notNull(),

		isActive: boolean("is_active").default(false),

		bomType: text("bom_type").notNull(),

		notes: text("notes"),
	},
	(table) => [
		uniqueIndex("uniqueVersion").on(table.itemVariantId, table.version),
	],
);
export const oBomItems = sqliteTable("o_bom_items", {
	...auditColumns,

	bomId: uuid("bom_id")
		.notNull()
		.references(() => oBoms.id, { onDelete: "cascade" }),

	componentItemId: uuid("component_item_id")
		.notNull()
		.references(() => oItems.id, { onDelete: "cascade" }),

	qty: decimal("qty", { precision: 12, scale: 4 }).notNull(),

	uomId: uuid("uom_id")
		.notNull()
		.references(() => oUoms.id, { onDelete: "cascade" }),

	notes: text("notes"),
});
export const oLocations = sqliteTable("o_locations", {
	...auditColumns,
  code: text("code").notNull(),
  name: text("name").notNull(),
});
export const oItemAttributes = sqliteTable("o_item_attributes", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),
  key: text("key").notNull(),   // color, finish
  value: text("value").notNull(),
});
export const oItemLedgerEntries = sqliteTable("o_item_ledger_entries", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),
  locationId: text("location_id"),

	qty: decimal("qty", { precision: 10, scale: 2 }), // + or -
  uomId: text("uom_id").notNull(),

  type: text("type").notNull(), // purchase | sale | production | adjustment
  refId: text("ref_id"), // link to document
});
export const oItemJournals = sqliteTable("o_item_journals", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),
	qty: decimal("qty", { precision: 10, scale: 2 }), // + or -
  uomId: text("uom_id").notNull(),

  type: text("type").notNull(),
  status: text("status").notNull(), // draft | posted
});
export const oItemCrossRefs = sqliteTable("o_item_cross_refs", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),

  refType: text("ref_type").notNull(), // customer | supplier | marketplace
  refCode: text("ref_code").notNull(),
  refName: text("ref_name"),
});
export const oItemCosts = sqliteTable("o_item_costs", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),
	cost: decimal("cost", { precision: 10, scale: 2 }),

  effectiveDate: timestamp("obtained_at").defaultNow().notNull(),
});
export const oItemPrices = sqliteTable("o_item_prices", {
	...auditColumns,
  itemVariantId: text("item_variant_id").notNull(),
	price: decimal("price", { precision: 10, scale: 2 }),

  currency: text("currency").notNull(), // USD, SGD, etc
  customerGroup: text("customer_group"),

  effectiveDate: timestamp("obtained_at").defaultNow().notNull(),
});
export const oVendors = sqliteTable("o_vendors", {
	...auditColumns,
  code: text("code").notNull(),
  name: text("name").notNull(),
  contact: text("contact"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
});
export const oPurchaseRequisitions = sqliteTable("o_purchase_requisitions", {
	...auditColumns,
  code: text("code").notNull(),
  documentDate: text("document_date").notNull(),

  status: text("status").notNull(), // draft | approved | reject | process-PO | closed

  reason: text("reason"),

  requestedBy: text("requested_by"),
  madeBy: text("made_by"),
  knownBy: text("known_by"),
  knownSign: timestamp("known_sign"),
  approvedBy: text("approved_by"),
  approvedSign: timestamp("approved_sign"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const oPurchaseRequisitionLines = sqliteTable("o_purchase_requisition_lines", {
	...auditColumns,
  requisitionId: uuid("requisition_id").notNull(),
  itemVariantId: uuid("item_variant_id").notNull(),

  	itemName: text("item_name"),
  	qty: decimal("qty", { precision: 18, scale: 4 }).notNull(),
    qtyOrdered: decimal("qty_ordered", {
      precision: 18,
      scale: 4,
    }).default(0),
	conversionValue: decimal("conversion_value", {
		precision: 12,
		scale: 6,
	}).notNull(),
  	note: text("note"),

  uomId: uuid("uom_id").notNull(),
});
export const oPurchaseOrders = sqliteTable("o_purchase_orders", {
	...auditColumns,

  code: text("code").notNull(),
  vendorId: uuid("vendor_id").notNull(),

  status: text("status").notNull(), // draft / confirmed / closed

  orderDate: timestamp("order_date"),
  expectedDate: timestamp("expected_date"),
});
export const oPurchaseOrderLines = sqliteTable("o_purchase_order_lines", {
	...auditColumns,

  orderId: uuid("order_id").notNull(),
  itemVariantId: uuid("item_variant_id").notNull(),

    itemName: text("item_name"),

  qty: decimal("qty", { precision: 18, scale: 4 }).notNull(),

    qtyReceived: decimal("qty_received", {
      precision: 18,
      scale: 4,
    }).default(0),
  uomId: uuid("uom_id").notNull(),

  cost: decimal("cost", { precision: 18, scale: 4 }),
});
export const oJuncPurchaseOrderLineRequisitionLines = sqliteTable(
  "o_junc_purchase_order_line_requisition_lines",
  {
	...auditColumns,

    purchaseOrderLineId: uuid("purchase_order_line_id").notNull(),

    purchaseRequisitionLineId: uuid(
      "purchase_requisition_line_id"
    ).notNull(),

    qtyLinked: decimal("qty_linked", {
      precision: 18,
      scale: 4,
    }).notNull(),
  }
);
export const oPurchaseReceipts = sqliteTable("o_purchase_receipts", {
	...auditColumns,

  code: text("code").notNull(),
  vendorId: uuid("vendor_id").notNull(),

  purchaseOrderId: uuid("purchase_order_id"),

  receiptDate: timestamp("receipt_date").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const oPurchaseReceiptLines = sqliteTable("o_purchase_receipt_lines", {
	...auditColumns,

  receiptId: uuid("receipt_id").notNull(),

    purchaseOrderLineId: uuid(
      "purchase_order_line_id"
    ).notNull(),
  itemVariantId: uuid("item_variant_id").notNull(),
    itemName: text("item_name"),

  qty: decimal("qty", { precision: 18, scale: 4 }).notNull(),

    qtyInvoiced: decimal("qty_invoiced", {
      precision: 18,
      scale: 4,
    }).default(0),
  uomId: uuid("uom_id").notNull(),

  cost: decimal("cost", { precision: 18, scale: 4 }),
});
export const oPurchaseInvoices = sqliteTable("o_purchase_invoices", {
	...auditColumns,

  code: text("code").notNull(),
  vendorId: uuid("vendor_id").notNull(),

  invoiceDate: timestamp("invoice_date").notNull(),

  status: text("status").notNull(), // draft / posted
});
export const oPurchaseInvoiceLines = sqliteTable("o_purchase_invoice_lines", {
	...auditColumns,

  invoiceId: uuid("invoice_id").notNull(),

    purchaseReceiptLineId: uuid(
      "purchase_receipt_line_id"
    ).notNull(),
  itemVariantId: uuid("item_variant_id").notNull(),

    itemName: text("item_name"),

  qty: decimal("qty", { precision: 18, scale: 4 }).notNull(),
  uomId: uuid("uom_id").notNull(),

  cost: decimal("cost", { precision: 18, scale: 4 }),
});
export const oPostedPurchaseReceipts = sqliteTable("o_posted_purchase_receipts", {
	...auditColumns,

  sourceId: uuid("source_id"),
  code: text("code").notNull(),

  vendorId: uuid("vendor_id").notNull(),
  receiptDate: timestamp("receipt_date").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});




/*
// Users (for pity tracking)
export const nGachaUsers = sqliteTable("n_gacha_users", {
	...auditColumns,
	star5Pity: integer("star5_pity").default(0),
	star4Pity: integer("star4_pity").default(0),
	star5Guarantee: text("star5_guarantee").default("OFF"),
	selectedBanner: text("selected_banner"),
});

// Banners
export const nGachaBanners = sqliteTable("n_gacha_banners", {
	...auditColumns,
	code: text("code").primaryKey(),
	name: text("name"),
	type: text("type"), // wpn, char, etc
	data: jsonb("data"), // store 4★ / 5★ pool
});

// Standard pools (instead of std_43 etc)
export const nGachaStandardPools = sqliteTable("n_gacha_standard_pools", {
	...auditColumns,
	code: text("code").primaryKey(), // std_char, std_wpn, etc
	data: jsonb("data"),
});

// Settings
export const nGachaSettings = sqliteTable("n_gacha_settings", {
	...auditColumns,
	probabilities: jsonb("probabilities"),
	pity: jsonb("pity"),
	softPityStart: integer("soft_pity_start"),
});*/