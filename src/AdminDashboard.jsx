import { useEffect, useState } from 'react';
import './AdminDashboard.css';

const emptyForm = {
  id: '',
  title: '',
  publisher: '',
  publishedAt: '',
  category: '',
  summary: '',
  url: '',
};

export default function AdminDashboard() {
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState('loading');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [tableError, setTableError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [...new Set(announcements.map((item) => item.category))].sort();
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = [item.id, item.title, item.publisher, item.category, item.summary]
      .some((value) => String(value).toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    switch (sortOrder) {
      case 'oldest':
        return a.publishedAt.localeCompare(b.publishedAt) || a.id.localeCompare(b.id);
      case 'title':
        return a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
      case 'publisher':
        return a.publisher.localeCompare(b.publisher) || a.id.localeCompare(b.id);
      default:
        return b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id);
    }
  });

  const totalPages = Math.max(1, Math.ceil(sortedAnnouncements.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedAnnouncements = sortedAnnouncements.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  function resetPagination() {
    setCurrentPage(1);
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      id: item.id,
      title: item.title,
      publisher: item.publisher,
      publishedAt: item.publishedAt,
      category: item.category,
      summary: item.summary,
      url: item.url,
    });
    setFormMessage('');
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
    setFormMessage('');
  }

  async function deleteAnnouncement(item) {
    if (deletingId || saving) return;
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    setDeletingId(item.id);
    setTableError('');
    try {
      const response = await fetch(`/api/announcements/${encodeURIComponent(item.id)}`, {
        method: 'DELETE',
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || 'Could not delete announcement');

      setAnnouncements((current) => current.filter((record) => record.id !== item.id));
      if (editingId === item.id) cancelEdit();
    } catch (error) {
      setTableError(error.message || 'Could not delete announcement');
    } finally {
      setDeletingId(null);
    }
  }

  async function createAnnouncement(event) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setFormError('');
    setFormMessage('');

    try {
      const response = await fetch(
        editingId ? `/api/announcements/${encodeURIComponent(editingId)}` : '/api/announcements',
        {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Could not create announcement');
      }

      setAnnouncements((current) => (
        editingId
          ? current.map((item) => item.id === editingId ? result : item)
          : [...current, result]
      ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id)));
      setStatus('success');
      setForm(emptyForm);
      setFormMessage(editingId ? 'Announcement updated successfully.' : 'Announcement saved successfully.');
      setEditingId(null);
    } catch (error) {
      setFormError(error.message || 'Could not create announcement.');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch('/api/announcements', { signal: controller.signal });
        if (!response.ok) throw new Error('Unable to fetch announcements');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Unexpected API response');
        setAnnouncements(data);
        setStatus('success');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Admin announcements request failed:', error);
          setStatus('error');
        }
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return (
    <main className="admin-dashboard">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">RUPA / LOCAL DEVELOPMENT</p>
            <h1>Announcements dashboard</h1>
            <p>Manage announcements stored in SQLite during local development.</p>
          </div>
          <a className="admin-back" href="/">Back to RUPA ↗</a>
        </header>

        <section className="admin-create" aria-labelledby="admin-create-heading">
          <h2 id="admin-create-heading">{editingId ? "Edit announcement" : "Create announcement"}</h2>
          <p>{editingId ? "Update the selected announcement. Its ID stays unchanged." : "Add a curated announcement with a link to its original source."}</p>
          <form onSubmit={createAnnouncement} className="admin-create-form">
            <div className="admin-form-grid">
              {[
                { name: 'id', label: 'Unique ID', placeholder: 'example-ai-release', maxLength: 100, pattern: '[a-z0-9]+(-[a-z0-9]+)*' },
                { name: 'title', label: 'Title', placeholder: 'Announcement title', maxLength: 200 },
                { name: 'publisher', label: 'Publisher', placeholder: 'Official publisher', maxLength: 120 },
                { name: 'publishedAt', label: 'Publication date', type: 'date' },
                { name: 'category', label: 'Category', placeholder: 'MODEL RELEASE', maxLength: 80 },
                { name: 'url', label: 'Original source URL', type: 'url', placeholder: 'https://example.com/article', maxLength: 2048 },
              ].map((field) => (
                <label className="admin-field" key={field.name}>
                  <span>{field.label}</span>
                  <input
                    name={field.name}
                    type={field.type || 'text'}
                    value={form[field.name]}
                    onChange={updateField}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    pattern={field.pattern}
                    disabled={field.name === 'id' && Boolean(editingId)}
                    required
                  />
                </label>
              ))}
            </div>
            <label className="admin-field admin-summary-field">
              <span>Summary</span>
              <textarea name="summary" value={form.summary} onChange={updateField} rows={4} maxLength={2000} required placeholder="Briefly explain what was announced." />
            </label>
            <div className="admin-form-actions">
              <button type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Create announcement'}</button>
              {editingId && <button type="button" className="admin-cancel" onClick={cancelEdit} disabled={saving}>Cancel editing</button>}
              {formMessage && <p className="admin-form-success" role="status">{formMessage}</p>}
              {formError && <p className="admin-form-error" role="alert">{formError}</p>}
            </div>
          </form>
        </section>

        {status === 'loading' && <p className="admin-message" role="status">Loading announcements…</p>}
        {status === 'error' && (
          <p className="admin-message" role="alert">
            Could not load announcements. Check that Flask is running on port 5000 and refresh.
          </p>
        )}
        {status === 'success' && (
          <>
            <div className="admin-summary">
              <span>Stored announcements</span>
              <strong>{announcements.length}</strong>
            </div>
            <div className="admin-filters">
              <label className="admin-field">
                <span>Search announcements</span>
                <input
                  type="search"
                  placeholder="Search title, publisher, category..."
                  value={searchQuery}
                  onChange={(event) => { setSearchQuery(event.target.value); resetPagination(); }}
                />
              </label>
              <label className="admin-field">
                <span>Filter by category</span>
                <select value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); resetPagination(); }}>
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field">
                <span>Sort announcements</span>
                <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); resetPagination(); }}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title A–Z</option>
                  <option value="publisher">Publisher A–Z</option>
                </select>
              </label>
              <label className="admin-field">
                <span>Rows per page</span>
                <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); resetPagination(); }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </label>
            </div>
            <p className="admin-filter-count" role="status">
              Showing {filteredAnnouncements.length} of {announcements.length} announcements
            </p>
            {tableError && <p className="admin-form-error admin-table-error" role="alert">{tableError}</p>}
            {announcements.length === 0 ? (
              <p className="admin-message">No announcements are stored yet.</p>
            ) : filteredAnnouncements.length === 0 ? (
              <p className="admin-message">No announcements match your filters.</p>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Publisher</th>
                      <th scope="col">Category</th>
                      <th scope="col">Published</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAnnouncements.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong><small>{item.id}</small></td>
                        <td>{item.publisher}</td>
                        <td>{item.category}</td>
                        <td><time dateTime={item.publishedAt}>{item.dateLabel}</time></td>
                        <td className="admin-row-actions">
                          <button type="button" onClick={() => startEdit(item)} disabled={saving || Boolean(deletingId)}>Edit</button>
                          <button type="button" className="admin-delete" onClick={() => deleteAnnouncement(item)} disabled={saving || Boolean(deletingId)}>
                            {deletingId === item.id ? 'Deleting…' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {filteredAnnouncements.length > 0 && (
              <nav className="admin-pagination" aria-label="Announcement pages">
                <span>
                  Showing {(activePage - 1) * pageSize + 1}–{Math.min(activePage * pageSize, sortedAnnouncements.length)} of {sortedAnnouncements.length}
                </span>
                <div className="admin-pagination-buttons">
                  <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={activePage === 1}>
                    Previous
                  </button>
                  <span>Page {activePage} of {totalPages}</span>
                  <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={activePage === totalPages}>
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
        <p className="admin-note">
          Development preview only. This page has no admin authentication. Create, edit, and delete are enabled for local testing only.
          Do not expose management APIs publicly.
        </p>
      </div>
    </main>
  );
}
