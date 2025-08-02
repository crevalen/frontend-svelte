import { BREVO_API_KEY } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import brevo from '@getbrevo/brevo';
import type { Actions } from './$types';

const contactApi = new brevo.ContactsApi();
contactApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, BREVO_API_KEY);

export const actions: Actions = {
  // Nama action 'default' karena kita hanya punya satu di halaman ini
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');

    if (!email || typeof email !== 'string') {
      return fail(400, { success: false, message: 'Email tidak valid.' });
    }

    try {
      const createContact = new brevo.CreateContact();
      createContact.email = email;
      createContact.listIds = [2];

      await contactApi.createContact(createContact);
      return { success: true, message: 'Berhasil mendaftar!' };

    } catch (e) {
      console.error('Brevo API Error:', e);
      
      if (typeof e === 'object' && e !== null && 'response' in e) {
        const brevoError = e as { response?: { data?: { code?: string } } };
        
        if (brevoError.response?.data?.code === 'duplicate_parameter') {
          return fail(409, { success: false, message: 'Email ini sudah terdaftar.' });
        }
      }
      return fail(500, { success: false, message: 'Gagal mendaftar ke newsletter.' });
    }
  }
};