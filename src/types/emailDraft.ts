export interface EmailContact {
  ime: string;
  email: string;
}

export interface PravnaEkipaClan {
  ime: string;
  podrocje: string;
  dostopen: boolean;
}

export interface EmailDraft {
  od: EmailContact;
  za: EmailContact;
  zadeva: string;
  pozdrav: string;
  uvod: string;
  opis_problema: string;
  povzetek: string[];
  vprasanja: string[];
  pravna_ekipa: PravnaEkipaClan[];
  naslednji_koraki: string[];
  zakljucek: string;
  podpis: string;
  generirano: string;
}
