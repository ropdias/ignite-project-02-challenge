// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      session_id?: string;
      name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date: number;
      is_on_daily_diet: boolean;
      created_at: string;
      updated_at: string;
    };
  }
}
