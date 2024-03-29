// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: string;
      created_at: string;
      session_id?: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description: string;
      date_and_time: string;
      was_on_daily_diet: boolean;
      created_at: string;
    };
  }
}
