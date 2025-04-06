// app/services/api.ts
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'https://walks-islamic-branches-usr.trycloudflare.com/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

// Obtener el token guardado
const getToken = async (): Promise<string | null> => {
  const token = await SecureStore.getItemAsync('jwt');
  return token; // Si no hay token, retorna null
};


const headers = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'GET',
        headers: await headers(), // Usar el token aquí
      });

      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tareas:', error);
      throw error;
    }
  },

  getTarea: async (id: number): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'GET',
        headers: await headers(), // Usar el token aquí
      });

      if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      throw error;
    }
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        headers: await headers(), // Usar el token aquí
        body: JSON.stringify(tarea)
      });

      if (!response.ok) throw new Error('Error creating tarea');
      return await response.json();
    } catch (error) {
      console.error('Error creating tarea:', error);
      throw error;
    }
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'PUT',
        headers: await headers(), // Usar el token aquí
        body: JSON.stringify(tarea)
      });

      if (!response.ok) throw new Error(`Error updating tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      throw error;
    }
  },

  deleteTarea: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE',
        headers: await headers(), // Usar el token aquí
      });

      if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      throw error;
    }
  },

  login: async (username: string, password: string): Promise<{ token: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login fallido: ${errorText}`);
      }

      const data = await response.json();
      return data; // { token: '...' }

    } catch (error) {
      console.error('Error durante login:', error);
      throw error;
    }
  },

  register: async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }
  
    } catch (error) {
      console.error('Error durante registro:', error);
      throw error;
    }
  }
};
