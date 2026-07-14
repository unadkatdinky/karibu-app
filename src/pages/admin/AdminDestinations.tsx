import { useEffect, useState } from 'react';
import PageHeader from '../../components/dashboard/PageHeader';
import Panel from '../../components/dashboard/Panel';
import DataTable, { type Column } from '../../components/dashboard/DataTable';
import DestinationTile from '../../components/dashboard/DestinationTile';
import {
  fetchAllDestinationsAdmin,
  fetchDestinationAdmin,
  createDestinationAdmin,
  updateDestinationAdmin,
  toggleDestinationActive,
  type AdminDestination,
  type DestinationFormInput,
} from '../../api/admin/destinations';

type Status = 'loading' | 'ready' | 'error';

const EMPTY_FORM: DestinationFormInput = {
  name: '',
  region: '',
  shortDescription: '',
  longDescription: '',
  coverImageUrl: '',
  galleryImageUrls: [],
  color: '#D4A853',
};

const inputClass =
  'w-full bg-white border border-[#E3E1DA] rounded-[6px] px-3 py-2 text-[13px] text-[#1A1A1A] placeholder:text-[#B0AEA6] outline-none focus:border-[#C4522A] focus:ring-2 focus:ring-[#C4522A]/10 transition-shadow';

function SectionLabel({ children, first = false }: { children: React.ReactNode; first?: boolean }) {
  return (
    <p
      className={`text-[11px] uppercase tracking-[0.06em] font-semibold text-[#9A9890] mb-3 ${
        first ? '' : 'pt-1 border-t border-[#EEEDE6]'
      }`}
    >
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-medium text-[#4A4A45] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ImagePreview({ url, size = 48 }: { url: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const isEmpty = !url.trim();

  if (isEmpty || failed) {
    return (
      <div
        className="shrink-0 rounded-[6px] bg-[#FAFAF7] border border-dashed border-[#D8D6CE] flex items-center justify-center text-[#B0AEA6]"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-4 h-4">
          <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="M3 17l5-5 4 4 3-3 6 6" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="shrink-0 rounded-[6px] bg-cover bg-center border border-[#E3E1DA]"
      style={{ width: size, height: size, backgroundImage: `url(${url})` }}
    >
      <img src={url} onError={() => setFailed(true)} alt="" className="hidden" />
    </div>
  );
}

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState<AdminDestination[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DestinationFormInput>(EMPTY_FORM);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setStatus('loading');
    fetchAllDestinationsAdmin()
      .then((data) => {
        setDestinations(data);
        setStatus('ready');
      })
      .catch(() => {
        setErrorMsg('Could not load destinations.');
        setStatus('error');
      });
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setGalleryUrls([]);
    setFormOpen(true);
  }

  async function openEditForm(id: string) {
    setErrorMsg('');
    try {
      const d = await fetchDestinationAdmin(id);
      setEditingId(d.id);
      setForm({
        name: d.name,
        region: d.region,
        shortDescription: d.shortDescription,
        longDescription: d.longDescription,
        coverImageUrl: d.coverImageUrl,
        galleryImageUrls: d.galleryImageUrls,
        color: d.color,
      });
      setGalleryUrls(d.galleryImageUrls);
      setFormOpen(true);
    } catch {
      setErrorMsg('Could not load that destination for editing.');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');

    const input: DestinationFormInput = {
      ...form,
      galleryImageUrls: galleryUrls.map((u) => u.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        const updated = await updateDestinationAdmin(editingId, input);
        setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      } else {
        const created = await createDestinationAdmin(input);
        setDestinations((prev) => [created, ...prev]);
      }
      setFormOpen(false);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error ?? 'Could not save this destination.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(id: string) {
    try {
      const isActive = await toggleDestinationActive(id);
      setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, isActive } : d)));
    } catch {
      setErrorMsg('Could not update that destination — try again.');
    }
  }

  function updateGalleryUrl(index: number, value: string) {
    setGalleryUrls((prev) => prev.map((u, i) => (i === index ? value : u)));
  }

  function removeGalleryUrl(index: number) {
    setGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  }

  const columns: Column<AdminDestination>[] = [
    {
      header: 'Destination',
      accessor: (d) => (
        <div className="flex items-center gap-3">
          <ImagePreview url={d.coverImageUrl} size={36} />
          <div>
            <p className="font-semibold">{d.name}</p>
            <p className="text-[11.5px] text-[#888]">{d.region}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (d) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
            d.isActive ? 'bg-[#DEF1E8] text-[#1C3A2E]' : 'bg-[#F3F4F6] text-[#888]'
          }`}
        >
          {d.isActive ? 'Active' : 'Hidden'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      accessor: (d) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => openEditForm(d.id)}
            className="text-[12px] font-semibold text-[#1C3A2E] hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleToggleActive(d.id)}
            className="text-[12px] font-semibold text-[#C4522A] hover:underline"
          >
            {d.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="pb-12">
      <PageHeader
        title="Manage destinations"
        subtitle="Add, edit, or hide places in the traveler-facing catalog."
        action={
          !formOpen && (
            <button
              onClick={openCreateForm}
              className="bg-[#1C3A2E] text-[#F5EDD8] px-5 py-2.5 rounded-[10px] text-[13px] font-semibold hover:bg-[#163025] transition-colors"
            >
              + Add destination
            </button>
          )
        }
      />

      {errorMsg && (
        <p className="text-[13px] text-[#C4522A] bg-[#C4522A]/10 rounded-lg px-4 py-2.5 mb-4">{errorMsg}</p>
      )}

      {formOpen && (
        <div className="bg-white rounded-2xl border border-[#1C3A2E]/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 mb-6">
          <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#EEEDE6]">
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1A]">
                {editingId ? 'Edit destination' : 'New destination'}
              </p>
              <p className="text-[12.5px] text-[#9A9890] mt-0.5">
                {editingId ? 'Update this place in the catalog.' : 'Add a place to the traveler-facing catalog.'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="bg-white text-[#4A4A45] border border-[#D8D6CE] px-3.5 py-1.5 rounded-[6px] text-[13px] font-semibold hover:bg-[#FAFAF7] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="destination-form"
                disabled={saving}
                className="bg-[#C4522A] text-white px-3.5 py-1.5 rounded-[6px] text-[13px] font-semibold disabled:opacity-50 hover:bg-[#a53f1f] transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create destination'}
              </button>
            </div>
          </div>

          <form id="destination-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
              <div>
                <SectionLabel first>Basic info</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <Field label="Name">
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Zanzibar"
                    />
                  </Field>
                  <Field label="Region">
                    <input
                      required
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Tanzania"
                    />
                  </Field>
                </div>

                <SectionLabel>Description</SectionLabel>
                <div className="space-y-3 mb-5">
                  <Field label="Short (shown on the browse tile)">
                    <input
                      required
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      className={inputClass}
                      placeholder="One line that sells the place"
                    />
                  </Field>
                  <Field label="Long (shown on the detail page)">
                    <textarea
                      required
                      rows={4}
                      value={form.longDescription}
                      onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                      className={`${inputClass} leading-relaxed`}
                      placeholder="A few sentences a traveler would actually want to read..."
                    />
                  </Field>
                </div>

                <SectionLabel>Media</SectionLabel>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <ImagePreview url={form.coverImageUrl} />
                    <div className="flex-1">
                      <Field label="Cover image URL">
                        <input
                          required
                          value={form.coverImageUrl}
                          onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                          className={inputClass}
                          placeholder="https://..."
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-[6px] border border-[#E3E1DA] shrink-0"
                      style={{ backgroundColor: form.color }}
                    />
                    <div className="flex-1">
                      <Field label="Tile fallback color">
                        <input
                          required
                          value={form.color}
                          onChange={(e) => setForm({ ...form, color: e.target.value })}
                          className={inputClass}
                          placeholder="#D4A853"
                        />
                      </Field>
                    </div>
                  </div>

                  <div>
                    <span className="block text-[12.5px] font-medium text-[#4A4A45] mb-2">Gallery</span>
                    <div className="space-y-2">
                      {galleryUrls.map((url, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <ImagePreview url={url} size={36} />
                          <input
                            value={url}
                            onChange={(e) => updateGalleryUrl(i, e.target.value)}
                            className={`${inputClass} flex-1`}
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryUrl(i)}
                            aria-label="Remove image"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[#C4522A] hover:bg-[#C4522A]/10 transition-colors shrink-0"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setGalleryUrls((prev) => [...prev, ''])}
                      className="mt-2.5 text-[12.5px] font-semibold text-[#C4522A] hover:text-[#a53f1f] transition-colors"
                    >
                      + Add another image
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.06em] font-semibold text-[#9A9890] mb-3">
                  Live preview
                </p>
                <div className="border border-[#E3E1DA] rounded-[10px] overflow-hidden sticky top-4">
                  <DestinationTile
                    name={form.name || 'Destination name'}
                    color={form.color || '#2D5A3D'}
                    image={form.coverImageUrl || undefined}
                  />
                  <div className="p-3 bg-white">
                    <p className="text-[11px] text-[#9A9890] mb-1">{form.region || 'Region'}</p>
                    <p className="text-[12px] text-[#4A4A45] leading-relaxed">
                      {form.shortDescription || 'Short description will appear here...'}
                    </p>
                  </div>
                </div>
                <p className="text-[11.5px] text-[#B0AEA6] mt-2.5">
                  This is how it appears on the Explore page.
                </p>
              </div>
            </div>
          </form>
        </div>
      )}

      <Panel title="All destinations" className="mb-0">
        {status === 'loading' ? (
          <p className="text-[13px] text-[#888]">Loading...</p>
        ) : (
          <DataTable columns={columns} rows={destinations} emptyMessage="No destinations yet." />
        )}
      </Panel>
    </div>
  );
}