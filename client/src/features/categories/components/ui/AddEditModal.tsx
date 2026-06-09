import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../../services/categories.api';
import type { Category } from '../../types';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  category?: Category | null;
  onClose: () => void;
  onSuccess: () => void;
};

const AddEditModal = ({ category, onClose, onSuccess }: Props) => {
  const isEdit = !!category;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const { loading, execute } = useAsyncFetch<any>();

  // Populate data if in Edit Mode
  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setPreviewUrl(category.imageUrl || '');
    } else {
      setName('');
      setDescription('');
      setPreviewUrl('');
      setImageFile(null);
    }
  }, [category]);

  // Handle image preview revocation
  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      setImageFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('description', description.trim());

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await execute(async () => {
        if (isEdit && category) {
          const id = category.id || category._id || '';
          return await categoriesApi.update(id, formData);
        } else {
          return await categoriesApi.create(formData);
        }
      });

      toast.success(isEdit ? 'Category updated successfully' : 'Category created successfully');
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred';
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isEdit ? 'Edit Category' : 'Create Category'}
            </h2>
            <p className="text-xs text-muted mt-1">
              {isEdit
                ? 'Update category details and image properties'
                : 'Add a brand new category to the platform'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-border bg-background p-2 text-muted hover:bg-background hover:text-foreground transition-all active:scale-95 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
          {/* Left Panel: Fields */}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wider">
                Category Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Banquet Halls"
                maxLength={100}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/65 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-foreground uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the category..."
                maxLength={500}
                className="min-h-[140px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/65 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-all active:scale-[0.98] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-accent transition-all disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              >
                {loading
                  ? isEdit
                    ? 'Updating...'
                    : 'Creating...'
                  : isEdit
                    ? 'Save Changes'
                    : 'Create Category'}
              </button>
            </div>
          </div>

          {/* Right Panel: Image Upload & Preview */}
          <div className="flex flex-col rounded-2xl border border-border bg-surface p-4">
            <h3 className="mb-3 text-xs font-bold text-foreground uppercase tracking-wider">
              Category Image
            </h3>

            {/* Drag & Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`
                relative flex flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer min-h-[260px]
                ${
                  dragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-background/40'
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {previewUrl ? (
                <div className="relative h-full w-full group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-[220px] w-full rounded-lg object-cover shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-8 w-8 text-white animate-bounce" />
                    <span className="text-white text-xs font-semibold ml-2">Change Image</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="rounded-full bg-background p-3 text-muted border border-border">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Upload an image</p>
                    <p className="text-xs text-muted mt-1">Drag and drop, or click to browse</p>
                    <p className="text-[10px] text-muted/65 mt-2">
                      Supports JPG, PNG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
