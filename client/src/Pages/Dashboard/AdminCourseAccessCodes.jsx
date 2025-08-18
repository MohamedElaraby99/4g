import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../Layout/Layout";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import { adminGenerateCourseAccessCodes, adminListCourseAccessCodes } from "../../Redux/Slices/CourseAccessSlice";

export default function AdminCourseAccessCodes() {
  const dispatch = useDispatch();
  const { courses } = useSelector((s) => s.course);
  const { admin, error } = useSelector((s) => s.courseAccess);

  const [form, setForm] = useState({ courseId: "", quantity: 1, accessStartAt: "", accessEndAt: "" });

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  useEffect(() => {
    dispatch(adminListCourseAccessCodes({ courseId: form.courseId || undefined }));
  }, [dispatch, form.courseId]);

  // Initialize default date range (now -> now + 7 days) if empty
  useEffect(() => {
    const toLocalInputValue = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    if (!form.accessStartAt || !form.accessEndAt) {
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      setForm((p) => ({
        ...p,
        accessStartAt: p.accessStartAt || toLocalInputValue(now),
        accessEndAt: p.accessEndAt || toLocalInputValue(end)
      }));
    }
  }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onGenerate = async (e) => {
    e.preventDefault();
    if (!form.courseId) return;
    const payload = {
      courseId: form.courseId,
      quantity: Number(form.quantity)
    };
    const toLocalInputValue = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    if (!form.accessStartAt || !form.accessEndAt) {
      const now = new Date();
      const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      payload.accessStartAt = toLocalInputValue(now);
      payload.accessEndAt = toLocalInputValue(end);
    } else {
      payload.accessStartAt = form.accessStartAt;
      payload.accessEndAt = form.accessEndAt;
    }
    if (new Date(payload.accessEndAt) <= new Date(payload.accessStartAt)) {
      alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
      return;
    }
    console.log('📤 Generating course access codes with payload:', payload);
    await dispatch(adminGenerateCourseAccessCodes(payload));
    dispatch(adminListCourseAccessCodes({ courseId: form.courseId }));
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6" dir="rtl">
        <h1 className="text-3xl font-bold mb-6">أكواد الوصول للكورسات</h1>
        <form onSubmit={onGenerate} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4" dir="rtl">
          <div>
            <label className="block text-sm mb-1">الكورس</label>
            <select name="courseId" value={form.courseId} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700">
              <option value="">اختر كورس</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">تاريخ البداية</label>
            <input name="accessStartAt" type="datetime-local" required value={form.accessStartAt} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">تاريخ النهاية</label>
            <input name="accessEndAt" type="datetime-local" required min={form.accessStartAt} value={form.accessEndAt} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div>
            <label className="block text-sm mb-1">العدد</label>
            <input name="quantity" type="number" min="1" max="200" value={form.quantity} onChange={onChange} className="w-full p-2 rounded border dark:bg-gray-700" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">توليد الأكواد</button>
          </div>
        </form>

        {error && <div className="text-red-600 mb-4">{String(error)}</div>}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">الأكواد المُنشأة</h2>
            {admin.listing && <span className="text-sm text-gray-500">جاري التحميل...</span>}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="p-2">الكود</th>
                  <th className="p-2">الفترة</th>
                  <th className="p-2">الحالة</th>
                  <th className="p-2">انتهاء صلاحية الكود</th>
                </tr>
              </thead>
              <tbody>
                {admin.codes.map((c) => (
                  <tr key={c._id || c.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="p-2 font-mono">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">{c.code}</span>
                    </td>
                    <td className="p-2">{c.accessStartAt && c.accessEndAt ? `${new Date(c.accessStartAt).toLocaleString('ar-EG')} ← ${new Date(c.accessEndAt).toLocaleString('ar-EG')}` : '-'}</td>
                    <td className="p-2">{c.isUsed ? "مُستخدم" : "متاح"}</td>
                    <td className="p-2">{c.codeExpiresAt ? new Date(c.codeExpiresAt).toLocaleString('ar-EG') : '-'}</td>
                  </tr>
                ))}
                {admin.codes.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">لا توجد أكواد</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}


