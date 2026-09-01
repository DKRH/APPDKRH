export type GachaBanner = {
	id: number;
	name: string;
	soft: number;
	hard: number;
	uprate5: number;
	uprate4: number;
};

export type GachaItem = {
	id: number;
	name: string;
	rarity: number;
	featured?: number;
	is_featured?: "FEATURED" | "STANDARD";
};

export type PullResponse = {
	results: GachaItem[];

	pity: {
		pity5: number;
		guarantee5: number;
	};

	banner: {
		soft: number;
		hard: number;
	};
};