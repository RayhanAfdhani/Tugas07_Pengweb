import React, { useState, useEffect } from 'react';
import styles from './PersonalWeb.module.css';

const EMPTY_FORM = {
  title: '',
  codeName: '',
  description: '',
  genre: '',
  rating: '',
  releaseYear: '',
  price: '',
  platforms: '',
  badge: '',
  image: '',
  developer: '',
};

export default function PersonalWeb() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notice, setNotice] = useState('');

  const API_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/games`;

  const fetchGameCatalog = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Gagal terhubung ke server katalog.');
      }

      setGames(await response.json());
    } catch (err) {
      console.error('Data fetch error:', err);
      setError('Gagal memuat katalog game. Silakan periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(''), 3000);
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (game) => {
    setEditingId(game.id);
    setForm({
      title: game.title,
      codeName: game.codeName,
      description: game.description,
      genre: game.genre,
      rating: String(game.rating),
      releaseYear: String(game.releaseYear),
      price: String(game.price),
      platforms: game.platforms.join(', '),
      badge: game.badge,
      image: game.image,
      developer: game.developer,
    });
    setFormError('');
    setSelectedGame(null);
    setFormOpen(true);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');

    const payload = {
      ...form,
      rating: Number(form.rating),
      releaseYear: Number(form.releaseYear),
      price: form.price === '' ? 0 : Number(form.price),
      platforms: form.platforms.split(',').map((p) => p.trim()).filter(Boolean),
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const msg = Array.isArray(body.message) ? body.message.join(', ') : body.message;
        throw new Error(msg || 'Gagal menyimpan game.');
      }

      setFormOpen(false);
      showNotice(editingId ? 'Game berhasil diperbarui.' : 'Game berhasil ditambahkan.');
      await fetchGameCatalog();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${deleteTarget.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Gagal menghapus game.');
      showNotice(`Game "${deleteTarget.title}" berhasil dihapus.`);
      setDeleteTarget(null);
      setSelectedGame(null);
      await fetchGameCatalog();
    } catch (err) {
      setDeleteTarget(null);
      showNotice(err.message);
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
            <div className={styles.buttonGroup}>
              <button className={styles.refreshBtn} onClick={openAddForm}>
                ➕ Tambah Game
              </button>
              <button
                className={styles.refreshBtn}
                onClick={fetchGameCatalog}
                disabled={loading}
              >
                🔄 Perbarui Katalog
              </button>
            </div>
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
                      <div className={styles.cardActions}>
                        <button className={styles.editButton} onClick={() => openEditForm(game)}>
                          ✏️ Ubah
                        </button>
                        <button className={styles.deleteButton} onClick={() => setDeleteTarget(game)}>
                          🗑️ Hapus
                        </button>
                      </div>
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
                <button className={styles.editButton} onClick={() => openEditForm(selectedGame)}>
                  ✏️ Ubah
                </button>
                <button className={styles.deleteButton} onClick={() => setDeleteTarget(selectedGame)}>
                  🗑️ Hapus
                </button>
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

      {formOpen && (
        <div className={styles.modalOverlay} onClick={() => !saving && setFormOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setFormOpen(false)}
              aria-label="Tutup"
            >
              ✕
            </button>
            <form className={styles.formBody} onSubmit={handleSubmit}>
              <h2 className={styles.formTitle}>
                {editingId ? 'Ubah Data Game' : 'Tambah Game Baru'}
              </h2>

              <div className={styles.formGrid}>
                <label className={styles.formField}>
                  <span>Judul</span>
                  <input name="title" value={form.title} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Kode Nama</span>
                  <input name="codeName" value={form.codeName} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Genre</span>
                  <input name="genre" value={form.genre} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Developer</span>
                  <input name="developer" value={form.developer} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Rating (0 - 5)</span>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Tahun Rilis</span>
                  <input name="releaseYear" type="number" min="1970" max="2035" value={form.releaseYear} onChange={handleFormChange} required />
                </label>
                <label className={styles.formField}>
                  <span>Harga (USD)</span>
                  <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleFormChange} />
                </label>
                <label className={styles.formField}>
                  <span>Badge</span>
                  <input name="badge" value={form.badge} onChange={handleFormChange} required />
                </label>
                <label className={`${styles.formField} ${styles.formFull}`}>
                  <span>Platform (pisahkan dengan koma)</span>
                  <input name="platforms" value={form.platforms} onChange={handleFormChange} placeholder="PC (Steam), PS5" required />
                </label>
                <label className={`${styles.formField} ${styles.formFull}`}>
                  <span>URL Gambar</span>
                  <input name="image" value={form.image} onChange={handleFormChange} required />
                </label>
                <label className={`${styles.formField} ${styles.formFull}`}>
                  <span>Deskripsi</span>
                  <textarea name="description" rows="3" value={form.description} onChange={handleFormChange} required />
                </label>
              </div>

              {formError && <p className={styles.formError}>{formError}</p>}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCloseActionButton}
                  onClick={() => setFormOpen(false)}
                  disabled={saving}
                >
                  Batal
                </button>
                <button type="submit" className={styles.submitButton} disabled={saving}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={`${styles.modalContent} ${styles.confirmBox}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.formTitle}>Hapus Game?</h3>
            <p className={styles.statusText}>
              Game <strong>{deleteTarget.title}</strong> akan dihapus permanen dari database.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCloseActionButton} onClick={() => setDeleteTarget(null)}>
                Batal
              </button>
              <button className={styles.dangerButton} onClick={handleDelete}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && <div className={styles.toast}>{notice}</div>}

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