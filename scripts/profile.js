const SUPABASE_URL = 'https://iabclikcfddqjcswhqwo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYmNsaWtjZmRkcWpjc3docXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjM4NjIsImV4cCI6MjA2OTY5OTg2Mn0.IpGizEYbKqQUb8muy335lYCeP-u7mrFLJLUQO9oHPkw'; // truncated
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 🧩 Utility: Toast feedback
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// 🔐 Get current user
async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('User not authenticated');
  return user;
}

// 📥 Load or create profile
async function loadProfile() {
  try {
    const user = await getCurrentUser();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('avatar_url, name, age, address, email')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!profile) {
      await supabase.from('profiles').upsert({
        id: user.id,
        name: '',
        age: null,
        address: '',
        email: user.email,
        avatar_url: ''
      }, { onConflict: 'id' });
      return loadProfile(); // reload after insert
    }

    // 🖼️ Populate static display
    document.getElementById('name').textContent = profile.name || '—';
    document.getElementById('age').textContent = profile.age || '—';
    document.getElementById('address').textContent = profile.address || '—';
    document.getElementById('email').textContent = profile.email || '—';
    document.getElementById('profile-photo').src = profile.avatar_url || 'default.png';

    // 📝 Populate editable inputs
    document.getElementById('name-input').value = profile.name || '';
    document.getElementById('age-input').value = profile.age ?? '';
    document.getElementById('address-input').value = profile.address || '';
  } catch (err) {
    console.error('Profile load error:', err.message);
    showToast('Failed to load profile', 'error');
  }
}


// 📸 Upload avatar
async function uploadAvatar() {
  const fileInput = document.getElementById('photo-upload');
  const file = fileInput?.files?.[0];
  if (!file) return showToast('No file selected', 'warning');

  try {
    const user = await getCurrentUser();
    const fileName = `user-${user.id}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    const { data: publicData, error: urlError } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    if (urlError || !publicData?.publicUrl) throw new Error('Failed to get public URL');

    const publicUrl = publicData.publicUrl;

    // 🔍 Fetch existing profile to preserve required fields
    const { data: existing, error: fetchError } = await supabase
      .from('profiles')
      .select('name, age, address, email')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError || !existing) throw new Error('Profile fetch failed before update');

    const updatedProfile = {
      id: user.id,
      name: existing.name || '',
      age: existing.age ?? null,
      address: existing.address || '',
      email: existing.email || user.email,
      avatar_url: publicUrl
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(updatedProfile, { onConflict: 'id' });

    if (updateError) throw updateError;

    document.getElementById('profile-photo').src = publicUrl;
    showToast('Photo updated successfully!', 'success');
  } catch (err) {
    console.error('Upload failed:', err.message);
    showToast(`Upload failed: ${err.message}`, 'error');
  }
}


// 🚪 Logout
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout failed:', error.message);
    showToast('Logout failed', 'error');
    return;
  }
  showToast('Logged out', 'info');
  window.location.href = 'login.html';
}

// 🚀 Init
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  document.getElementById('change-photo')?.addEventListener('click', uploadAvatar);
  document.getElementById('logout-button')?.addEventListener('click', logout);
});

document.getElementById('save-profile')?.addEventListener('click', async () => {
  try {
    const user = await getCurrentUser();
    const name = document.getElementById('name-input').value.trim();
    const age = parseInt(document.getElementById('age-input').value);
    const address = document.getElementById('address-input').value.trim();

    if (!name) return showToast('Name is required', 'warning');

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, name, age, address }, { onConflict: 'id' });

    if (error) throw error;

    showToast('Profile updated!', 'success');
    loadProfile();

    // Hide edit form after save
    document.querySelector('.profile-fields').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('edit-profile-toggle').textContent = 'Edit Profile Info';
  } catch (err) {
    console.error('Profile update failed:', err.message);
    showToast('Update failed', 'error');
  }
});

document.getElementById('edit-profile-toggle')?.addEventListener('click', () => {
  const form = document.querySelector('.profile-fields');
  const display = document.getElementById('user-info');
  const toggleBtn = document.getElementById('edit-profile-toggle');

  const isEditing = form.style.display === 'block';

  form.style.display = isEditing ? 'none' : 'block';
  display.style.display = isEditing ? 'block' : 'none';
  toggleBtn.textContent = isEditing ? 'Edit Profile Info' : 'Cancel';
});
