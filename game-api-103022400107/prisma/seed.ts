import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const games = [
  { title: 'Cyber Runner 2077', codeName: 'CYBER-2077', description: 'Aksi RPG di kota neon masa depan dengan pilihan cerita yang bercabang dan dunia terbuka yang luas.', genre: 'Cyberpunk / Action RPG', rating: 4.9, releaseYear: 2024, price: 59.99, platforms: ['PC (Steam)', 'PS5'], badge: 'Editor Choice', image: img('photo-1542751371-adc38448a05e'), developer: 'Afdhani Studio' },
  { title: 'Vanguard X', codeName: 'VANGUARD-X', description: 'Pertempuran luar angkasa skala besar dengan armada yang dapat dikustomisasi penuh.', genre: 'Sci-Fi / Space Combat', rating: 4.8, releaseYear: 2023, price: 49.99, platforms: ['PC (Windows)', 'SteamOS'], badge: 'Trending #1', image: img('photo-1550745165-9bc0b252726f'), developer: 'Rayhan Digital Lab' },
  { title: 'Soul Chronicles', codeName: 'SOUL-CHRONICLES', description: 'Petualangan dark fantasy bergaya soulslike dengan bos yang menantang dan dunia yang suram.', genre: 'Dark Fantasy / Soulslike', rating: 4.9, releaseYear: 2024, price: 69.99, platforms: ['PC (Steam)', 'Xbox Series X'], badge: 'Masterpiece', image: img('photo-1518709268805-4e9042af9f23'), developer: 'FromAfdhani Archive' },
  { title: 'Neon Protocol', codeName: 'NEON-PROTOCOL', description: 'Misi stealth taktis di jaringan siber dengan soundtrack elektronik yang ikonik.', genre: 'Tactical Stealth / Cyber Ops', rating: 4.7, releaseYear: 2023, price: 39.99, platforms: ['PC (Steam)', 'Cloud Gaming'], badge: 'Best Soundtrack', image: img('photo-1538481199705-c710c4e965fc'), developer: 'Kojima & Rayhan Partner' },
  { title: 'Orbital Infinity', codeName: 'ORBITAL-INFINITY', description: 'Simulasi ruang angkasa mendalam, mulai dari membangun stasiun hingga menjelajah galaksi.', genre: 'Deep Space Simulation', rating: 4.8, releaseYear: 2025, price: 44.99, platforms: ['PC (Steam)', 'Steam VR'], badge: 'Most Anticipated', image: img('photo-1618005182384-a83a8bd57fbe'), developer: 'Cosmic Rayhan Works' },
  { title: 'Apex Legends Zero', codeName: 'APEX-LEGENDS-ZERO', description: 'Battle royale FPS cepat dengan karakter unik dan mode tim yang kompetitif.', genre: 'Battle Royale / FPS', rating: 4.6, releaseYear: 2024, price: 0, platforms: ['PC (Steam)', 'PS5', 'Xbox'], badge: 'Popular', image: img('photo-1511512578047-dfb367046420'), developer: 'Afdhani Esports Lab' },
];

async function main() {
  if ((await prisma.game.count()) > 0) {
    console.log('Tabel games sudah berisi data, seed dilewati.');
    return;
  }
  await prisma.game.createMany({ data: games });
  console.log(`${games.length} game berhasil di-seed.`);
}

main().finally(() => prisma.$disconnect());
