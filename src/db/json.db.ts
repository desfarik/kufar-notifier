import JSONdb from 'simple-json-db';

export const JSON_DB_TOKEN = 'JSON_DB_TOKEN';

export interface DB_SCHEMA {
  lastSyncTime: number;
}



interface _JSON_DB<K> {
  set(key: keyof K, value: K[keyof K]) : void;
  get(key: keyof K) : K[keyof K] | undefined;
  has(key: keyof K) : boolean;
  delete(key: keyof K) : boolean | undefined;
  deleteAll() : this;
  sync() : void;
  JSON() : Record<keyof K, K[keyof K]>;
}

export interface JSON_DB extends _JSON_DB<DB_SCHEMA> {

}
