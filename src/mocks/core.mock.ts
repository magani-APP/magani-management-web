export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface Pharmacy {
  id: string;
  name: string;
}

export const mockCurrentUser: User = {
  id: "usr_12345",
  name: "Dr. Kofi Diallo",
  role: "Propriétaire",
  initials: "KD",
};

export const mockPharmacy: Pharmacy = {
  id: "phar_1",
  name: "Pharmacie Centrale",
};
