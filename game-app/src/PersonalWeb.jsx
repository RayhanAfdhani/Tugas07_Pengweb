import React, { useState, useEffect } from 'react';
import styles from './PersonalWeb.module.css';

export default function PersonalWeb() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'https://dummyjson.com/products?limit=6';

  const fetchGameCatalog = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Gagal terhubung ke server katalog.');
      }

      const data = await response.json();

      const gamePresets = [
        {
          codeName: 'CYBER-2077',
          genre: 'Cyberpunk / Action RPG',
          rating: '4.9',
          releaseYear: '2024',
          platforms: ['PC (Steam)', 'PS5'],
          badge: 'Editor Choice',
          image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
          developer: 'Afdhani Studio'
        },
        {
          codeName: 'VANGUARD-X',
          genre: 'Sci-Fi / Space Combat',
          rating: '4.8',
          releaseYear: '2023',
          platforms: ['PC (Windows)', 'SteamOS'],
          badge: 'Trending #1',
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80',
          developer: 'Rayhan Digital Lab'
        },
        {
          codeName: 'SOUL-CHRONICLES',
          genre: 'Dark Fantasy / Soulslike',
          rating: '4.9',
          releaseYear: '2024',
          platforms: ['PC (Steam)', 'Xbox Series X'],
          badge: 'Masterpiece',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
          developer: 'FromAfdhani Archive'
        },
        {
          codeName: 'NEON-PROTOCOL',
          genre: 'Tactical Stealth / Cyber Ops',
          rating: '4.7',
          releaseYear: '2023',
          platforms: ['PC (Steam)', 'Cloud Gaming'],
          badge: 'Best Soundtrack',
          image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=900&q=80',
          developer: 'Kojima & Rayhan Partner'
        },
        {
          codeName: 'ORBITAL-INFINITY',
          genre: 'Deep Space Simulation',
          rating: '4.8',
          releaseYear: '2025',
          platforms: ['PC (Steam)', 'Steam VR'],
          badge: 'Most Anticipated',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
          developer: 'Cosmic Rayhan Works'
        },
        {
          codeName: 'APEX-LEGENDS-ZERO',
          genre: 'Battle Royale / FPS',
          rating: '4.6',
          releaseYear: '2024',
          platforms: ['PC (Steam)', 'PS5', 'Xbox'],
          badge: 'Popular',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
          developer: 'Afdhani Esports Lab'
        }
      ];

      const enrichedGames = data.products.map((item, idx) => {
        const preset = gamePresets[idx % gamePresets.length];
        return {
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          brand: item.brand || 'Original Title',
          ...preset
        };
      });

      setGames(enrichedGames);
    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Gagal memuat katalog game. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameCatalog();
  }, []);

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <div className={styles.navContent}>
          <div className={styles.brand}>
            <span role="img" aria-label="Controller" style={{ fontSize: '28px' }}>🎮</span>
            <div>
              <h1 className={styles.brandTitle}>RAYHAN GAMES CATALOG</h1>
              <p className={styles.brandSubtitle}>
                Digital Gaming Hub & Archive • Curated by M. Rayhan Ramadhan Afdhani
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.heroCard}>
          <div className={styles.heroText}>
            <span className={styles.categoryTag}>PORTAL GAME DIGITAL</span>
            <h2 className={styles.heroTitle}>Eksplorasi Judul Game Modern Pilihan</h2>
            <p className={styles.heroDescription}>
              Temukan koleksi game terbaik, informasi rilis terbaru, spesifikasi platform, 
              dan ulasan komprehensif dalam satu portal arsip game digital yang terintegrasi.
            </p>
          </div>
          <div className={styles.actionPanel}>
            <button
              className={styles.refreshBtn}
              onClick={fetchGameCatalog}
              disabled={loading}
            >
              🔄 Perbarui Katalog
            </button>
          </div>
        </div>
      </section>

      <main className={styles.mainContent}>
        <div className={styles.filterBar}>
          <div className={styles.sectionHeaderTitle}>
            <h3>DAFTAR KATALOG GAME</h3>
            <span className={styles.catalogCount}>
              {loading ? 'Memuat...' : `${filteredGames.length} Game Tersedia`}
            </span>
          </div>

          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Cari berdasarkan judul, genre, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className={styles.statusBox}>
            <div className={styles.spinner}></div>
            <h4 className={styles.statusTitle}>Memuat Katalog Game...</h4>
            <p className={styles.statusText}>
              Mengambil daftar game terbaru dari pustaka server. Mohon tunggu sejenak.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className={`${styles.statusBox} ${styles.errorBox}`}>
            <h4 className={styles.errorTitle}>Gagal Memuat Katalog</h4>
            <p className={styles.errorMessage}>{error}</p>
            <button className={styles.retryButton} onClick={fetchGameCatalog}>
              🔄 Muat Ulang Katalog
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {filteredGames.length === 0 ? (
              <div className={styles.statusBox}>
                <h4 className={styles.statusTitle}>Game Tidak Ditemukan</h4>
                <p className={styles.statusText}>
                  Tidak ada game yang cocok dengan pencarian "{searchQuery}".
                </p>
                <button className={styles.retryButton} onClick={() => setSearchQuery('')}>
                  Reset Pencarian
                </button>
              </div>
            ) : (
              <div className={styles.catalogGrid}>
                {filteredGames.map((game) => (
                  <article key={game.id} className={styles.gameCard}>
                    <div className={styles.cardImageWrapper}>
                      <img
                        src={game.image}
                        alt={game.title}
                        className={styles.cardImage}
                        loading="lazy"
                      />
                      <span className={styles.cardBadge}>{game.badge}</span>
                      <div className={styles.ratingBadge}>★ {game.rating} / 5.0</div>
                    </div>

                    <div className={styles.cardBody}>
                      <div className={styles.genreTag}>{game.genre}</div>
                      <h4 className={styles.gameTitle} title={game.title}>
                        {game.title}
                      </h4>
                      <p className={styles.gameExcerpt}>
                        {game.description.length > 90
                          ? `${game.description.substring(0, 90)}...`
                          : game.description}
                      </p>

                      <div className={styles.cardMeta}>
                        <span className={styles.platformBadge}>
                          {game.platforms[0]}
                        </span>
                        <span className={styles.releaseYear}>{game.releaseYear}</span>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button
                        className={styles.detailButton}
                        onClick={() => setSelectedGame(game)}
                      >
                        Lihat Detail Game →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedGame && (
        <div className={styles.modalOverlay} onClick={() => setSelectedGame(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setSelectedGame(null)}
              aria-label="Tutup"
            >
              ✕
            </button>

            <div className={styles.modalHeaderImageWrapper}>
              <img
                src={selectedGame.image}
                alt={selectedGame.title}
                className={styles.modalHeaderImage}
              />
              <div className={styles.modalHeaderOverlay}>
                <span className={styles.modalBadge}>{selectedGame.badge}</span>
                <span className={styles.modalRating}>★ {selectedGame.rating} / 5.0</span>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalTopRow}>
                <span className={styles.modalGenre}>{selectedGame.genre}</span>
                <span className={styles.modalCodeName}>{selectedGame.codeName}</span>
              </div>

              <h2 className={styles.modalGameTitle}>{selectedGame.title}</h2>

              <div className={styles.descriptionSection}>
                <h4 className={styles.subHeading}>Ringkasan Game</h4>
                <p className={styles.modalFullDesc}>{selectedGame.description}</p>
              </div>

              <div className={styles.specsSection}>
                <h4 className={styles.subHeading}>Informasi & Platform</h4>
                <div className={styles.specsGrid}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Pengembang:</span>
                    <span className={styles.specValue}>{selectedGame.developer}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Tahun Rilis:</span>
                    <span className={styles.specValue}>{selectedGame.releaseYear}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Platform:</span>
                    <span className={styles.specValue}>{selectedGame.platforms.join(', ')}</span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Status:</span>
                    <span className={styles.specHighlight}>Tersedia di Pustaka</span>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  className={styles.modalCloseActionButton}
                  onClick={() => setSelectedGame(null)}
                >
                  Tutup Jendela Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <p className={styles.footerBrand}>Rayhan Games Catalog © {new Date().getFullYear()}</p>
            <p className={styles.footerSub}>
              Digital Archive & Showcase Portfolio • <strong>M. Rayhan Ramadhan Afdhani</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}