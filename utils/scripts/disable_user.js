import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

let utenti_ids = [
	20, 24, 33, 56, 57, 63, 67, 83, 89, 93, 96, 101, 128, 141, 154, 181, 193, 234, 235, 236, 237, 238,
	239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 252, 253, 254, 255, 256, 257, 258,
	259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277,
	278, 279, 280, 281, 282, 283, 284, 290, 297, 314, 327, 329, 340, 341, 347, 348, 349, 358, 359,
	376, 394, 426, 463, 467, 468, 469, 470, 471, 472, 473, 474, 475, 476, 477, 478, 479, 480, 530,
	588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604
];

/**
 * @param {string | any[]} argv
 */
async function main(argv) {
	utenti_ids.forEach(async (utente) => {
		console.log('Disabilito utente:', utente);
		try {
			await SARP.utente.update({
				where: { id: utente },
				data: {
					classeId: 1
				}
			});
		} catch (e) {
			console.log(e);
		}
	});
}

main();
