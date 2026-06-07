import React, { useEffect, useState } from "react";
import { categoriesApi } from "../../services/categories.api";

type Props = {
  setOpen: (action: boolean) => void;
};

const AddEditModal = ({ setOpen }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await categoriesApi.create(formData);

      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-5xl rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Create Category
            </h2>

            <p className="text-sm text-muted">
              Add a new category to the system
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="rounded-full border border-border p-2"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Electronics"
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Category description..."
                className="min-h-[160px] w-full rounded-xl border border-border bg-background px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-border px-5 py-3"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-primary px-5 py-3 font-medium text-white disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create Category"}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-4">
            <h3 className="mb-4 text-sm font-medium">
              Image Preview
            </h3>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-[320px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted">
                No image selected
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;