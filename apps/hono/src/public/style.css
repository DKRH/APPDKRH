const weaponList = document.getElementById("weapon-list");
const editor = document.getElementById("editor");

let currentWeapon = null;

async function loadWeapons() {
	const res = await fetch("/api/weapons");
	const weapons = await res.json();

	weaponList.innerHTML = "";

	for (const weapon of weapons) {
		const btn = document.createElement("button");

		btn.textContent = weapon;

		btn.onclick = async () => {
			currentWeapon = weapon;

			const file = await fetch(
				"/api/weapon/" + weapon
			);

			editor.value = await file.text();
		};

		weaponList.appendChild(btn);
	}
}

document.getElementById("save").onclick = async () => {
	if (!currentWeapon) return;

	await fetch("/api/weapon/" + currentWeapon, {
		method: "POST",
		body: editor.value
	});

	alert("Saved");
};

loadWeapons();