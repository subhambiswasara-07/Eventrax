
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { createEvent, getEventById, updateEvent } from "../../api/eventApi";
import { validateEventForm } from '../../utils/validators';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Loader } from '../../components/States';


const emptyForm = {
  title: "",
  description: "",
  date: "",
  location: "",
  price: "",
  totalSeats: "",
  availableSeats: "",
  imageUrl: "",
};

// Turns an ISO date into the value <input type="datetime-local"> expects.
const toLocalInputValue = (isoDate) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export default function EventForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const event = await getEventById(id);
        setForm({
          title: event.title,
          description: event.description,
          date: toLocalInputValue(event.date),
          location: event.location,
          price: String(event.price),
          totalSeats: String(event.totalSeats),
          availableSeats: String(event.availableSeats),
          imageUrl: event.imageUrl,
        });
      } catch (err) {
        setFormError(err.message || "Could not load this event");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditMode]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    const nextErrors = validateEventForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: new Date(form.date).toISOString(),
      location: form.location.trim(),
      price: Number(form.price),
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats),
      imageUrl: form.imageUrl.trim(),
    };

    setSaving(true);
    try {
      if (isEditMode) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      navigate("/admin");
    } catch (err) {
      setFormError(err.message || "Could not save this event");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading event" />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Admin Navigation */}
      <div className="mb-8 flex flex-wrap items-center gap-3 border-b-2 border-ink pb-5">
        <Link
          to="/admin"
          className="rounded-lg border-2 border-ink bg-paper px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-sunbeam"
        >
          Dashboard
        </Link>

        <Link
          to="/admin/events/new"
          className="rounded-lg border-2 border-ink bg-sunbeam px-4 py-2 font-body text-sm font-semibold text-ink transition"
        >
          Create Event
        </Link>

        <Link
          to="/admin/bookings"
          className="rounded-lg border-2 border-ink bg-paper px-4 py-2 font-body text-sm font-semibold text-ink transition hover:bg-electric hover:text-ink"
        >
          All Bookings
        </Link>
      </div>

      <h1 className="font-display text-3xl text-ink">
        {isEditMode ? "EDIT EVENT" : "CREATE EVENT"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        {formError && (
          <div className="rounded-xl border-2 border-flare bg-flare/10 px-4 py-3 font-body text-sm font-medium text-flare">
            {formError}
          </div>
        )}

        <Input
          label="Title"
          value={form.title}
          onChange={handleChange("title")}
          error={errors.title}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Description</label>

          <textarea
            rows={4}
            value={form.description}
            onChange={handleChange("description")}
            className={`w-full rounded-xl border-2 bg-chalk px-4 py-3 font-body text-ink focus:border-electric ${
              errors.description ? "border-flare" : "border-ink/20"
            }`}
          />

          {errors.description && (
            <p className="text-sm font-medium text-flare">
              {errors.description}
            </p>
          )}
        </div>

        <Input
          label="Date & time"
          type="datetime-local"
          value={form.date}
          onChange={handleChange("date")}
          error={errors.date}
        />

        <Input
          label="Location"
          value={form.location}
          onChange={handleChange("location")}
          error={errors.location}
        />

        <Input
          label="Image URL"
          placeholder="https://…"
          value={form.imageUrl}
          onChange={handleChange("imageUrl")}
          error={errors.imageUrl}
          hint="This is a plain URL field — there's no file upload on the backend."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Price ($)"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange("price")}
            error={errors.price}
          />

          <Input
            label="Total seats"
            type="number"
            min="1"
            value={form.totalSeats}
            onChange={handleChange("totalSeats")}
            error={errors.totalSeats}
          />

          <Input
            label="Available seats"
            type="number"
            min="0"
            value={form.availableSeats}
            onChange={handleChange("availableSeats")}
            error={errors.availableSeats}
          />
        </div>

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Preview"
            className="h-40 w-full rounded-xl border-2 border-ink object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" loading={saving}>
            {isEditMode ? "Save changes" : "Create event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
