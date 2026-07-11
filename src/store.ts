import { AppState, Election, User, Vote } from './types';

const INITIAL_STATE: AppState = {
  users: [
    {
      id: 'admin',
      name: 'System Admin',
      role: 'admin',
      passwordHash: 'admin123',
      passwordChanged: false,
    },
    {
      id: 'RSU2024001',
      name: 'Zakaria awil jama',
      role: 'student',
      passwordHash: 'RSU2024001',
      passwordChanged: false,
    },
    {
      id: 'RSU2024002',
      name: 'FATIMA NOOR',
      role: 'student',
      passwordHash: 'RSU2024002',
      passwordChanged: false,
    }
  ],
  elections: [
    {
      id: 'e1',
      title: 'Gudoomiyaha Ardayda (Student President)',
      startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      candidates: [
        {
          id: 'c1',
          name: 'FARAH ADEN ALI',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          bio: 'Ku dooro aqoon iyo akhlaaq. Waxaan u taaganahay inaan matalo codka ardayda.',
        },
        {
          id: 'c2',
          name: 'HALIMA MAHAMED ADEM',
          photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
          bio: 'Ku dooro isku xirnaanta ardayda iyo hormarinta waxbarashada.',
        }
      ]
    },
    {
      id: 'e2',
      title: 'Gudoomiye Ku Xigeen (Vice President)',
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      candidates: [
        {
          id: 'c3',
          name: 'AHMED HASSAN',
          photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
          bio: 'U codee horumar iyo cadaalad.',
        },
        {
          id: 'c4',
          name: 'ZAMZAM ALI',
          photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&w=300&q=80',
          bio: 'Waxaan hubin doonaa in baahiyaha ardayda la daboolo.',
        }
      ]
    }
  ],
  votes: []
};

const STORAGE_KEY = 'rsu_voting_system_data';

export const getStore = (): AppState => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STATE));
    return INITIAL_STATE;
  }
  return JSON.parse(data);
};

export const setStore = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearStore = () => {
  localStorage.removeItem(STORAGE_KEY);
};
